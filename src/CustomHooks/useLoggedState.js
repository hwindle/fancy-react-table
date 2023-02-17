import React, { useState, useEffect } from 'react';

const useLoggedState = (initialValue, isData) => {
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  let dataLog = [];
  let auxLog = [];
  let isReplaying = false;
  let replayID = 0;
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    if (isReplaying) {
      return;
    }
    if (isData) {
      dataLog.push([clone(state), setState]);
    } else {
      const idx = dataLog.length - 1;
      if (!auxLog[idx]) {
        auxLog[idx] = [];
      }
      auxLog[idx].push([state, setState]);
    }
  }, [state]);

  /***
   * Replay (refresh) the spreadsheet using custom hook
   * useLoggedState.
   */
  function replay() {
    isReplaying = true;
    let idx = 0;
    replayID = setInterval(() => {
      const [data, fn] = dataLog[idx];
      fn(data);
      auxLog[idx] && auxLog[idx].forEach((log) => {
        const [data, fn] = log;
        fn(data);
      });
      idx++;
      if (idx > dataLog.length - 1) {
        isReplaying = false;
        clearInterval(replayID);
        return;
      }
    }, 2000);
  }

  // starting replay 
  useEffect(() => {
    function keydownHandler(e) {
      if (e.altKey && e.shiftKey && e.keyCode === 88) {
        // alt + shift + x
        replay();
      }
    }

    document.addEventListener('keydown', keydownHandler);
    // clean up function
    return () => {
      document.removeEventListener('keydown', keydownHandler);
      clearInterval(replayID);
      dataLog = [];
      auxLog = [];
    };
  }, []);

  return [state, setState];
};

export default useLoggedState;
