// file: src/App.js
import React, { Component } from 'react';
import PhoneForm from './components/PhoneForm';
import PhoneInfoList from './components/PhoneInfoList';

class App extends Component {
  id = 2
  state = {
    classList: [
      {
        id: 0,
        name: '테스트수업',
        professor: '정인국',
        code: '0000000'
      },
      {
        id: 1,
        name: '프론트엔드 프로그래밍',
        professor: '이승진',
        code: '0000001'
      },
      {
        id: 2,
        name: '하이브리드 앱',
        professor: '김명철',
        code: '0000002'
      },
      {
        id: 3,
        name: '캡스톤 디자인',
        professor: '이승진',
        code: '0000003'
      }
    ]
  }
  handleCreate = (data) => {
    const { information } = this.state;
    this.setState({
      information: information.concat({ id: this.id++, ...data })
    })
  }
  render() {
    return (
      <div>
        <PhoneForm
          onCreate={this.handleCreate}
        />
        <PhoneInfoList data={this.state.information}/>
      </div>
    );
  }
}

export default App;