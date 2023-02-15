import React from 'react';
import PropTypes from 'prop-types';
import './Excel.css';

const Excel = ({headers, initialData}) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((title, idx) => (
            <th key={idx}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {initialData.map((row, idx) => (
          <tr key={idx}>
            {row.map((cell, idx) => (
              <td key={idx}>{cell}</td>
            ))}
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