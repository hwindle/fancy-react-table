import React from 'react';
import PropTypes from 'prop-types';

const Excel = (props) => {

};

Excel.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string),
  initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}

export default Excel;