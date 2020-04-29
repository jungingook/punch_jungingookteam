// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView, ScrollView, Button } from 'react-native';
// 컴포넌트 연결
import ClassCard from './ClassCard'; // 앱의 메인 화면 구성을 담당하는 컴포넌트

const layout = StyleSheet.create({
    margin : {
        width : "90%",
        marginLeft : "5%",
        marginRight : "5%",
        overflow : "scroll",
    },
  });
      
class Contents extends Component {
    render() {
      return (
        <ScrollView style={layout.margin}> 
            <Text>오늘의 수업</Text>
            <ClassCard/>
            <ClassCard/>
            <ClassCard/>
            <ClassCard/>
            <ClassCard/>
            <ClassCard/>
            <ClassCard/>
            <ClassCard/>
        </ScrollView>
      );
    }
  }
  
  export default Contents;