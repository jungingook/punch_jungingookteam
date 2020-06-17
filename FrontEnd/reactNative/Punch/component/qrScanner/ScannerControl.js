// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Button } from 'react-native';
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'
// 컴포넌트 연결

const layout = StyleSheet.create({
  Main: {
      display : "none"
  },
});

class ScannerControl extends Component {

    ScannerControl = (control) => {
        if (control == "MAIN") {
          this.props.moveMain()
        }
        else if (control == "QRSCAN") {

        }
    }
  
  render() {
    this.ScannerControl(this.props.control);
    return (
      <View >
      </View>
    );
  }
}


function mapStateToProps (state){
  return {
    AppMode: state.AppMode
  }
}
function mapDispatchToProps(dispatch){
  return {
    moveMain : () => dispatch({type:'NORMAL'}),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(ScannerControl);