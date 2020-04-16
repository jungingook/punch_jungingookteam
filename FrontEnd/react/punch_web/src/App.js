// file: src/App.js
import React, { Component } from 'react';
import QR from './QR.js';
import ClassInfoList from './classroom/ClassInfoList';
import './App.css';

class App extends Component {
  id = 4 // 지금까지 배열에 가지고 있는 개수 
  state = {
    classList: [
      {
        id: 0,
        name: '수업 이름',
        professor: '담당 교수',
        code: '000000'
      },
      {
        id: 1,
        name: '소프트웨어 캡스톤디자인',
        professor: '이승진',
        code: '000001'
      },
      {
        id: 2,
        name: '하이브리드 앱',
        professor: '김명철',
        code: '000002'
      },
      {
        id: 3,
        name: '사회봉사',
        professor: '누군지 모름',
        code: '000003'
      }
    ],
  }
  handleCreate = (data) => {
    console.log(data)
    const { classList } = this.state;
    this.setState({
      classList: classList.concat({ id: this.id++, ...data })
    })
  }
  render() {
    return (
      <div id="page">
        <div id="profile">
        <QR id="temp" /> 
        </div>
        <div id="content">
          {/* <PhoneForm
            onCreate={this.handleCreate}
          /> */}
          <ClassInfoList data={this.state.classList}/>

        </div>
      </div>
      
    );
  }
}

export default App;
