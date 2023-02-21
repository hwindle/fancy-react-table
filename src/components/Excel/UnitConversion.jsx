import React, { useState, useEffect } from 'react';

const UnitConversion = (props) => {
  const { unitType, conversion, data } = props;
  const [yardsData, setYardsData] = useState(0);

  function convert(unitType, conversion, data) {
    if (!unitType || !conversion || !data) {
      return;
    }

    if (typeof data !== 'number') {
      return;
    }

    switch (unitType) {
      case 'metres':
        if (conversion === 'metres_to_yards') {
          return Number(data) * 1.0936;
        }
        break;
      default:
        return -1;
    } // end switch
  }

  useEffect(() => {
    setYardsData(convert(unitType, conversion, data));
  }, [data]);

  return (
    <span className='unit-conversion'>
      {data}m / {yardsData}y
    </span>
  );
};

export default UnitConversion;
