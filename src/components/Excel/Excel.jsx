import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import './Excel.css';
import UnitConversion from './UnitConversion';
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
  
  // search bar state
  const [search, setSearch] = useState(false);

  function sort(e) {
    // sort data
    const column = e.target.cellIndex;
    // desc is set to true if the column is selected and
    // column is ascending.
    const descending = sorting.column === column && !sorting.descending;
    setSorting({ column, descending });
    dispatch({ type: 'sort', payload: { column, descending } });
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
    // setEdit(null);
  }

  // if search isn't set, return no JSX (? null :)
  const searchRow = !search ? null : (
    <tr className='search-row' onChange={filterData}>
      {headers.map((_, idx) => (
        <td key={idx}>
          <input
            type='text'
            className='search-input'
            data-idx={idx}
            placeholder='Filter'
          />
        </td>
      ))}
    </tr>
  );

  // the unicode code points are a down arrow & up arrow
  return (
    <section className='excel-table'>
      <div className='toolbar'>
        <button onClick={toggleSearch}>
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
        <tbody>
          {searchRow}
          {data.map((row, rowIdx) => {
            const recordId = shortID.generate();
            return (
              <tr key={recordId} data-row={rowIdx}>
                {row.map((cell, columnIdx) => {
                  if (columnIdx === headers.length) {
                    return;
                  }
                  // set column for unit conversions, col 4
                  // in example data (metres)
                  // render unit coversion component
                  if (
                    columnIdx === 4
                  ) {
                    cell = (
                      <UnitConversion unitType={'metres'} conversion={'metres_to_yards'} data={Number(cell)} />
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

