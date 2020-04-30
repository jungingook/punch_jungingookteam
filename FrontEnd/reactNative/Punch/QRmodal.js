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
    width : "50%",
    height : "50%"
  },
});

class ViewControl extends Component {

    appView = (mode) => {
        let output = <MainView/>
        if (mode == "MAIN") {
            checkState = <Text> 출석 </Text>
        }
        else if (mode == "QRSCAN") {
            checkState = <Text> 지각 </Text>
        }
        else if (mode == "QRscan1") {
            checkState = <Text> 결석 </Text>
        }
        else if (mode == "null") { 
            checkState = <Text> 인식불가  </Text>
        }
        return output
    }
  
  render() {
    return (
      <View style={layout.Main}>
        <View>
            
        </View>
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