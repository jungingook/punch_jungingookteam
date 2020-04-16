import React, { Component } from 'react';

class Counter extends Component {
  state = {
    number: 0
  }

  handleIncrease = () => {
    console.log("더하기 ")
    this.setState({
      number: this.state.number + 1
    });
  }

  handleDecrease = () => {
    console.log("빼기 ")
    this.setState({
      number: this.state.number - 1
    });
  }

  render() {
    return (
      <div>
        <h1>카운터</h1>
        <div>값: {this.state.number}</div>
        <div onClick={this.handleIncrease}>+</div>
        <div onClick={this.handleDecrease}>-</div>
      </div>
    );
  }
}

export default Counter;