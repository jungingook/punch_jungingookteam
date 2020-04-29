// 리엑트 모듈
import React, { Component } from 'react';
import Header from './Header';
import { Text, View, SafeAreaView, StyleSheet, Button } from 'react-native';
// [ajax] axios 연결
import axios from 'axios';
// [리듀스]스토어 연결
import { Provider } from 'react-redux'
import store from './store';

// 컴포넌트 연결
import MainView from './component/MainView'; // 앱의 메인 화면 구성을 담당하는 컴포넌트
import QRSanner from './QRSanner'; // 폰 인포 연결



const layout = StyleSheet.create({
  Main: {
    flex : 1,
    
  },
});
class App extends Component {
    appView = (mode) => {
      let output = <MainView/>
      if (mode == "main") {
          output = <MainView/>
      }
      else if (mode == "QRscan") {
          output = <SelectPanel color={this.props.select.color}/>
      }
      else if (mode == "QRscan1") {
          output = <QRreade select={this.props.select}/>
      }
      else if (mode == "QRactive") {
          output = <QRactive select={this.props.select}/>
      }
      return output
  }
  render() {
    return (
      // <QRSanner/>
        <SafeAreaView style={layout.Main}> 
          {/* <MainView/> */}
          {this.appView()/*(this.props.AppMode)*/}
          {/* <QRSanner/> */}
        </SafeAreaView>
    );
  }
}
export default App;
// const mapStateToProps = (state) => ({
//   AppMode : state.AppMode
// })

// export default connect(mapStateToProps)(App);

