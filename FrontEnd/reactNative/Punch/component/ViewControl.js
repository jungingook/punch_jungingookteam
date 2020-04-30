// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Button } from 'react-native';
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'
// 컴포넌트 연결
import MainView from './MainView'; // 앱의 메인 화면 구성을 담당하는 컴포넌트
import QRSanner from '../QRSanner';

const layout = StyleSheet.create({
  Main: {
    flex: 1,
  },
});


class ViewControl extends Component {

   appView = (mode) => {
      let output = <MainView/>
      if (mode == "MAIN") {
          output = <MainView/>
      }
      else if (mode == "QRSCAN") {
            output = <QRSanner/>
      }
      else if (mode == "QRscan1") {

      }
      else if (mode == "QRactive") { 

      }
      return output
  }

  render() {
    return (
      <View style={layout.Main}>
          {this.appView(this.props.AppMode)}
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

  }
}
export default connect(mapStateToProps,mapDispatchToProps)(ViewControl);