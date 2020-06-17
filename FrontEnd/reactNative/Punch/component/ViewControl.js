// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, SafeAreaView, ScrollView, StyleSheet, Button } from 'react-native';
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'
// 컴포넌트 연결
import MainView from './MainView'; // 앱의 메인 화면 구성을 담당하는 컴포넌트
import Login from './login/Login'; // 로그인 화면
import LoginInfo from './login/LoginInfo'; // 디바이스 정보를 업로드하는 화면
import ClassInfo from './classView/ClassInfo'; // 

const layout = StyleSheet.create({
  Main: {
    flex: 1,
  },
  SafeView: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0
  },
});


class ViewControl extends Component {

  state = {
    color:'#F6F7F9'
  }

   appView = (mode) => {
      let output = <MainView/>
      if (mode == "LOGIN") {
          output = <Login/>
      }
      if (mode == "LOGININFO") {
        output = <LoginInfo/>
      }
      if (mode == "CLASSVIEW") {
        output = <ClassInfo/>
      }
      return output
  }
  safeAreaColor= (mode) => {
    let color = '#F6F7F9'
    if (mode == "LOGIN") {
      color = '#F6F7F9'
      return color
    }
    if (mode == "LOGININFO") {
      color = '#FF1E26'
      return color
    }
    if (mode == "CLASSVIEW") {
      let color = '#000000'
      try { 
        color = this.props.cardColor[this.props.selectCard.color][1]
      }catch (e) {
      }
      return color
    }
    return color
}

  render() {
    return (
      <SafeAreaView style={[layout.SafeView,{backgroundColor :this.safeAreaColor(this.props.AppMode)}]}> 
      <View style={layout.Main}>
          {this.appView(this.props.AppMode)}
      </View>
      </SafeAreaView>
    );
  }
}


function mapStateToProps (state){
  return {
    AppMode: state.AppMode,
    selectCard: state.selectCard,
    cardColor : state.cardColor,
  }
}
function mapDispatchToProps(dispatch){
  return {

  }
}
export default connect(mapStateToProps,mapDispatchToProps)(ViewControl);