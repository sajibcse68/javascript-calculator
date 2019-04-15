import React from 'react';
import Display from './Display';
import Keypad from './Keypad';
import * as math from 'mathjs';

const calOb = {
  "zero": { text: "0" },
  "one": { text: "1" },
  "two": { text: "2" },
  "three": { text: "3" },
  "four": { text: "4"},
  "five": { text: "5"},
  "six": { text: "6"},
  "seven": { text: "7"},
  "eight": { text: "8"},
  "nine": { text: "9"},
  "equals": { text: "="},
  "add": { text: "+"},
  "subtract": { text: "-"},
  "multiply": { text: "×"},
  "divide": { text: "÷"},
  "decimal": { text: "."},
  "clear": { text: "AC"}
}

const evaluateFormula = parts => {
  const formula = parts
    .map(part => {
      switch (part) {
        case '×':
          return '*';
        case '÷':
          return '/';
        default:
          return part;
      }
    })
    .join(' ');

  return math.eval(formula);
};

const removeTrailingDecimal = num => {
  return num.endsWith('.') ? num.slice(0, num.length - 1) : num;
};

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.resetState();
  }

  componentDidMount() {
    document.addEventListener('keypress', this.keypressHandler);
  }

  resetState = () => {
    return {
      formulaParts: [],
      hasDecimal: false,
      current: '',
      // One of several types:
      // * null
      // * 'number'
      // * 'operator'
      // * 'result'
      currentType: null
    };
  };

  keypressHandler = event => {
    switch (event.key) {
      case '0':
        this.performOperation('zero');
        break;
      case '1':
        this.performOperation('one');
        break;
      case '2':
        this.performOperation('two');
        break;
      case '3':
        this.performOperation('three');
        break;
      case '4':
        this.performOperation('four');
        break;
      case '5':
        this.performOperation('five');
        break;
      case '6':
        this.performOperation('six');
        break;
      case '7':
        this.performOperation('seven');
        break;
      case '8':
        this.performOperation('eight');
        break;
      case '9':
        this.performOperation('nine');
        break;
      case '=':
        this.performOperation('equals');
        break;
      case '+':
        this.performOperation('add');
        break;
      case '-':
        this.performOperation('subtract');
        break;
      case '*':
        this.performOperation('multiply');
        break;
      case '/':
        this.performOperation('divide');
        break;
      case '.':
      case ',':
        this.performOperation('decimal');
        break;
      default:
        break;
    }
  };

  performOperation = id => {
    this.setState(previousState => this.updateState(previousState, id));
  };

  updateState = (previousState, id) => {
    switch (id) {
      case 'clear':
        return this.resetState();
      case 'decimal':
        return this.updateStateWithDecimal(previousState);
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        return this.updateStateWithOperator(previousState, id);
      case 'equals':
        return this.evaluateState(previousState);
      default:
        return this.updateStateWithNumber(previousState, id);
    }
  };

  updateStateWithNumber = (previousState, id) => {
    switch (previousState.currentType) {
      case null:
      case 'result':
        return {
          ...this.resetState(),
          ...{ current: calOb[id].text, currentType: 'number' }
        };
      case 'number':
        if (previousState.current === '0') {
          return {
            current: calOb[id].text
          };
        }
        return {
          current: previousState.current + calOb[id].text
        };
      case 'operator':
        return {
          formulaParts: [...previousState.formulaParts, previousState.current],
          current: calOb[id].text,
          currentType: 'number'
        };
      default:
        return {};
    }
  };

  evaluateState = previousState => {
    let result = null;
    if (
      previousState.formulaParts.length === 0 &&
      previousState.currentType !== 'number'
    ) {
      return previousState;
    }
    switch (previousState.currentType) {
      case null:
      case 'result':
        return previousState;
      case 'number':
        const newFormulaParts = [
          ...previousState.formulaParts,
          removeTrailingDecimal(previousState.current)
        ];
        result = '' + evaluateFormula(newFormulaParts) + '';
        return {
          formulaParts: [...newFormulaParts, '=', result],
          hasDecimal: false,
          current: result,
          currentType: 'result'
        };
      case 'operator':
        result = '' + evaluateFormula(previousState.formulaParts) + '';
        return {
          formulaParts: [...previousState.formulaParts, '=', result],
          hasDecimal: false,
          current: result,
          currentType: 'result'
        };
      default:
        return {};
    }
  };

  updateStateWithOperator = (previousState, id) => {
    if (
      (id === 'add' || id === 'subtract') &&
      previousState.currentType === null
    ) {
      return {
        current: calOb[id].text,
        currentType: 'operator'
      };
    } else if (previousState.currentType === 'null') {
      return previousState;
    } else if (previousState.currentType === 'result') {
      return {
        formulaParts: [previousState.current],
        current: calOb[id].text,
        currentType: 'operator'
      };
    } else if (previousState.currentType === 'number') {
      return {
        formulaParts: [
          ...previousState.formulaParts,
          removeTrailingDecimal(previousState.current)
        ],
        current: calOb[id].text,
        currentType: 'operator',
        hasDecimal: false
      };
    } else if (previousState.currentType === 'operator') {
      return {
        current: calOb[id].text
      };
    }
  };

  updateStateWithDecimal = previousState => {
    switch (previousState.currentType) {
      case null:
      case 'result':
        return {
          ...this.resetState(),
          ...{ hasDecimal: true, current: '0.', currentType: 'number' }
        };
      case 'operator':
        return {
          formulaParts: [...previousState.formulaParts, previousState.current],
          hasDecimal: true,
          current: '0.',
          currentType: 'number'
        };
      case 'number':
        if (previousState.hasDecimal) {
          return previousState;
        } else {
          return {
            hasDecimal: true,
            current: previousState.current + '.',
            currentType: 'number'
          };
        }
      default:
        return {};
    }
  };

  render() {
    return (
      <div id="calculator">
        <Display state={this.state} />
        <Keypad
          calOb={calOb}
          performOperation={this.performOperation}
        />
      </div>
    );
  }
}

export default Calculator;
