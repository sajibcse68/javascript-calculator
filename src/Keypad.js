import React from 'react';
import Key from './Key';

const Keypad = props => {
  const keys = Object.keys(props.calOb);

  return (
    <div id="keypad">
      {keys.map(key => {
        return (
          <Key
            key={key}
            btnId={key}
            btnOb={props.calOb[key]}
            performOperation={props.performOperation}
          />
        );
      })}
    </div>
  );
};

export default Keypad;
