// 모듈 임포트
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../store";
// React 임포트
import ClassInfoList from './classroom/ClassInfoList';
import Panel from './controlPanel/Panel';
import BackBnt from './interface/BackBnt';

import '../css/App.css';

class App extends Component {
  
  contentMove = (mode) => {
    let output = "contentMove_0"
    if (mode == "QRactive") {
      output = "contentMove_50"
    }
    else {
      output = "contentMove_0"
    }
    return output
  }
  
  render() {
    return (
      <div id="page">
        <div id = "L_Background">
          <div id ="CardzoneBackground"/>
          <div id ="QRzoneBackground"/>
        </div>
        <div id = "L_Content">
          <div id = "ContentPointer" className={this.contentMove(this.props.panelMode)}>
            <div id = "ContentLeft"> 
              <div id = "sidebar"></div>
              <ClassInfoList/>
            </div>
            <div id = "ContentRight"> 
              <Panel/>
            </div>
          </div>
        </div>
        <div id = "L_Interface">
          <BackBnt/>
        </div>
        <div id = "L_Modal">
          
          </div>
      </div>
      
    );
  }
}

//export default Panel;
const mapStateToProps = (state) => ({
  panelMode : state.panelMode,
})

export default connect(mapStateToProps)(App);