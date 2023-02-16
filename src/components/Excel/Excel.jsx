import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Excel.css';

const Excel = ({headers, initialData}) => {
  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState({
    column: null,
    descending: false,
  });
  const [edit, setEdit] = useState(null);

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
    setSorting({column, descending});
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

  // the unicode code points are a down arrow & up arrow
  return (
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
        {data.map((row, rowIdx) => (
          <tr key={rowIdx} data-row={rowIdx}>
            {row.map((cell, columnIdx) => {
              if ( edit && edit.row === rowIdx && edit.column === columnIdx) {
                cell = (
                  <form onSubmit={save}>
                    <input type="text" defaultValue={cell} />
                  </form>
                );
              }
              return <td key={columnIdx}>{cell}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Excel.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string),
  initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

export default Excel;