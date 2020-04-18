// 모듈 임포트
import React, { Component } from 'react';

// React 임포트
import QR from '../QR.js';
import ClassInfoList from './classroom/ClassInfoList';
import Panel from './controlPanel/Panel';

import '../css/App.css';

class App extends Component {
 
  render() {
    return (
      <div id="page">
        <div id = "L_Background">
          <div id ="CardzoneBackground"/>
          <div id ="QRzoneBackground"/>
        </div>
        <div id = "L_Content">
          <div id = "sidebar"></div>
          <ClassInfoList/>
          <Panel/>
          {/* <div id="profile">
          <QR id="temp" /> 
          </div> */}

        </div>
      </div>
      
    );
  }
}

export default App;
