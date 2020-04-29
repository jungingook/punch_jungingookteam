// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
// 컴포넌트 연결
import Header from './header/Header'; // 앱의 메인 화면 구성을 담당하는 컴포넌트
import Contents from './contents/Contents'; // 앱의 메인 화면 구성을 담당하는 컴포넌트
import Footer from './footer/Footer'; // 앱의 메인 화면 구성을 담당하는 컴포넌트
import QRButton from './qrScanner/QRButton'; // 큐알 버튼

const layout = StyleSheet.create({
  header: {
    backgroundColor :"#ffffff",
    fontSize: 30,
    height: 10,
    flex : 1,
  },
  contents:{
    flex : 8,
    backgroundColor :"#F6F7F9",
  },
  footer: {
    backgroundColor :"#ffffff",
    color: 'blue',
    fontSize: 30,
    flex : 1,
    height: 10,
  },
  QRButton: {
    backgroundColor :"#ffffff",
    color: 'blue',
    fontSize: 30,
    flex : 1,
    // 레이어 설정
    // zIndex: 3, // works on ios
    // elevate: 3, // works on android
  },
  Main: {
    flex : 1,
   
  },
});
class MainView extends Component {
  render() {
    return (
        <View style={layout.Main}>
          <View style={layout.header}> 
            <Header/>
          </View>
          <View style={layout.contents}> 
            <Contents/>
          </View>
          <View style={layout.footer}> 
            <Footer/>
          </View>
        </View>
    );
  }
}

export default MainView;