import React from 'react';

class Key extends React.Component {
  performOperation = () => {
    this.props.performOperation(this.props.btnId);
  };
  render() {
    return (
      <div
        className="key"
        id={this.props.btnId}
        onClick={this.performOperation}
      >
        {this.props.btnOb.text}
      </div>
    );
  }
}

export default Key;
