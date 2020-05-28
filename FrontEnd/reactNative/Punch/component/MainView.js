// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Button } from 'react-native';
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'
// 컴포넌트 연결
import Header from './header/Header'; // 앱의 메인 화면 구성을 담당하는 컴포넌트
import Contents from './contents/Contents'; // 앱의 메인 화면 구성을 담당하는 컴포넌트
import Footer from './footer/Footer'; // 앱의 메인 화면 구성을 담당하는 컴포넌트



const layout = StyleSheet.create({
  header: {
    backgroundColor :"#ffffff",
    height : 60,
  },
  contents:{
    flex : 1,
    backgroundColor :"#F6F7F9",
  },
  footer: {
    backgroundColor :"#ffffff",
    height : 60,
  },
  Main: {
    flex: 1,
    backgroundColor: 'white',
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
          <ScrollView>
            <Contents/>
          </ScrollView>
        </View>
        <View style={layout.footer}> 
          <Footer/>
        </View>
      </View>
    );
  }
}


function mapStateToProps (state){
  return {

  }
}
function mapDispatchToProps(dispatch){
  return {

  }
}
export default connect(mapStateToProps,mapDispatchToProps)(MainView);