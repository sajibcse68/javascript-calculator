import React from 'react';

const Display = props => {
  return (
    <div id="display-wrapper">
      <div id="formula-display">{props.state.formulaParts.join(' ')}</div>
      <div id="display">{props.state.current || '0'}</div>
    </div>
  );
};

export default Display;
