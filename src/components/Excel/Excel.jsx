import React from 'react';
import PropTypes from 'prop-types';
import './Excel.css';
import useLoggedState from '../../CustomHooks/useLoggedState';

const Excel = ({ headers, initialData }) => {
  const [data, setData] = useLoggedState(initialData, true);
  const [sorting, setSorting] = useLoggedState({
    column: null,
    descending: false,
  });
  const [edit, setEdit] = useLoggedState(null);
  // search bar state
  const [search, setSearch] = useLoggedState(false);
  const [preSearchData, setPreSearchData] = useLoggedState(null);

  // perform a deep clone of the (data) object
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function sort(e) {
    // sort data
    const column = e.target.cellIndex;
    // desc is set to true if the column is selected and
    // column is ascending.
    const descending = sorting.column === column && !sorting.descending;
    // don't modify state directly - leads to bugs
    const dataCopy = clone(data);
    dataCopy.sort((a, b) => {
      if (a[column] === b[column]) {
        return 0;
      }
      // can be written with two ternary statements
      // split up for readability.
      let sortType = 1;
      if (descending) {
        return a[column] < b[column] ? 1 : -1;
      } else {
        return a[column] > b[column] ? 1 : -1;
      }
    });
    // set the data
    setData(dataCopy);
    setSorting({ column, descending });
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
    const input = e.target.firstChild;
    const dataCopy = clone(data);
    // set data to be the input value entered in showEditor
    dataCopy[edit.row][edit.column] = input.value;
    // value to indicate we have finished editing
    setEdit(null);
    setData(dataCopy);
  }


  /**
   * Searching functions
   */
  function toggleSearch() {
    if (search) {
      // data from before the search
      setData(preSearchData);
      // search is true, so set it to false
      setSearch(false);
      // no filtered data
      setPreSearchData(null);
    } else {
      // save the data from before the filter
      setPreSearchData(data);
      // toggle the flag
      setSearch(true);
    }
  }

  function filterData(e) {
    const needle = e.target.value.toLowerCase();
    if (!needle) {
      setData(preSearchData);
      return;
    }
    console.log(e.target.dataset);
    const idx = e.target.dataset.idx;
    const haystack = preSearchData.filter((row) => {
      // .indexOf(needle) > -1 would also work as the
      // last chain here
      return row[idx].toString().toLowerCase().includes(needle);
    });
    setData(haystack);
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
        <tbody onDoubleClick={showEditor}>
          {searchRow}
          {data.map((row) => {
            const recordId = row[row.length - 1];
            return (
              <tr key={recordId} data-row={recordId}>
                {row.map((cell, columnIdx) => {
                  if (columnIdx === headers.length) {
                    return;
                  }
                  if (
                    edit &&
                    edit.row === recordId &&
                    edit.column === columnIdx
                  ) {
                    cell = (
                      <form onSubmit={save}>
                        <input className="cell-edit" type='text' defaultValue={cell} />
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
