import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import './Excel.css';
// for unique keys
import shortID from 'shortid';

// perform a deep clone of the (data) object
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
// reducer for the search
let originalData = null;
function reducer(data, action) {
  switch (action.type) {
    case 'sort':
      const { column, descending } = action.payload;
      return clone(data).sort((a, b) => {
        if (a[column] === b[column]) {
          return 0;
        }
        // can be written with two ternary statements
        // split up for readability.
        if (descending) {
          return a[column] < b[column] ? 1 : -1;
        } else {
          return a[column] > b[column] ? 1 : -1;
        }
      });

    case 'save':
      data[action.payload.edit.row][action.payload.edit.column] =
        action.payload.value;
      return data;

    case 'startSearching':
      originalData = data;
      return originalData;

    case 'doneSearching':
      return originalData;

    case 'search':
      return originalData.filter((row) => {
        return row[action.payload.column]
          .toString()
          .toLowerCase()
          .includes(action.payload.needle.toLowerCase());
      });
  } // end switch statement
}

const Excel = ({ headers, initialData }) => {
  const [data, dispatch] = useReducer(reducer, initialData);
  const [sorting, setSorting] = useState({
    column: null,
    descending: false,
  });
  const [edit, setEdit] = useState(null);
  // search bar state
  const [search, setSearch] = useState(false);

  function sort(e) {
    // sort data
    const column = e.target.cellIndex;
    // desc is set to true if the column is selected and
    // column is ascending.
    const descending = sorting.column === column && !sorting.descending;
    setSorting({ column, descending });
    dispatch({ type: 'sort', payload: {column, descending} });
  }

  // show a text input field for editing on dbl click
  function showEditor(e) {
    setEdit({
      row: parseInt(e.target.parentNode.dataset.row, 10),
      column: e.target.cellIndex,
    });
  }

  // save the data from showEditor above
  function save(e) {
    e.preventDefault();
    const input = e.target.firstChild.value;
    dispatch({
      type: 'save',
      payload: { edit, input },
    });
    setEdit(null);
  }

  /**
   * Searching functions
   */
  function toggleSearch() {
    if (!search) {
      dispatch({ type: 'startSearching' });
    } else {
      dispatch({ type: 'doneSearching' });
    }
    setSearch(!search);
  }

  function filterData(e) {
    const needle = e.target.value.toLowerCase();
    const column = e.target.dataset.idx;
    dispatch({
      type: 'search',
      payload: { needle, column },
    });
    setEdit(null);
  }

  // if search isn't set, return no JSX (? null :)
  const searchRow = !search ? null : (
    <tr className='search-row' onChange={filterData}>
      {headers.map((_, idx) => (
        <td key={idx}>
          <input type='text' className='search-input' data-idx={idx} />
        </td>
      ))}
    </tr>
  );

  // the unicode code points are a down arrow & up arrow
  return (
    <section className='excel-table'>
      <div className='toolbar'>
        <button
          onClick={toggleSearch}>
          {search ? 'Hide search' : 'Show search'}
        </button>
      </div>
      <table>
        <thead onClick={sort}>
          <tr>
            {headers.map((title, idx) => {
              if (sorting.column === idx) {
                title += sorting.descending ? ' \u2191' : ' \u2193';
              }
              return <th key={idx}>{title}</th>;
            })}
          </tr>
        </thead>
        <tbody onDoubleClick={showEditor}>
          {searchRow}
          {data.map((row, rowIdx) => {
            const recordId = shortID.generate();
            return (
              <tr key={rowIdx} data-row={rowIdx}>
                {row.map((cell, columnIdx) => {
                  if (columnIdx === headers.length) {
                    return;
                  }
                  if (
                    edit &&
                    edit.row === rowIdx &&
                    edit.column === columnIdx
                  ) {
                    cell = (
                      <form onSubmit={save}>
                        <input
                          className='cell-edit'
                          type='text'
                          defaultValue={cell}
                        />
                      </form>
                    );
                  }
                  return <td key={columnIdx}>{cell}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

Excel.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string),
  initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

export default Excel;
