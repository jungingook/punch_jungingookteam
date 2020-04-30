// 리엑트 모듈
import React, { Component } from 'react';
import { Platform, TouchableOpacity, View, Text, StyleSheet, Button } from 'react-native';
// 컴포넌트 연결

const classCard = StyleSheet.create({
    Layout : {
        width : "100%",
        height : 150,
        flexDirection : "column",
        borderRadius : 10,
        marginBottom : 20,
        ...Platform.select({ 
            ios: { 
                shadowColor: '#777777',
                shadowOffset: { width: 2, height: 2, },
                shadowOpacity: 0.6, shadowRadius: 4, 
                },
            android: { elevation: 8, },
            web:{
                
            }
            }), 
    },
    upper : {
        flex : 3,
        backgroundColor : "#00B0F0",
        borderTopLeftRadius : 10,
        borderTopRightRadius : 10,
        justifyContent : "space-between"
    },
    lower : {
        flex : 2,
        backgroundColor : "#009FF0",
        borderBottomLeftRadius : 10,
        borderBottomRightRadius : 10,
        flexDirection : "column",
        justifyContent : "center"
    },
  });

  const cardDesign = StyleSheet.create({
    calssTime : {
        color: "#fff",
        fontSize : 15,
        paddingLeft : '5%',
        paddingRight : '5%',
    },
    calssName : {
        paddingLeft : '5%',
        paddingRight : '5%',
        color: "#fff",
        fontSize : 30,
    },
  });

class Contents extends Component {
    render() {
      return (
        <View style={classCard.Layout}>
            <View style={classCard.upper}>
                <Text style={cardDesign.calssTime}>이승진/6201</Text>
                <Text style={cardDesign.calssTime}>월요일 11:00 ~ 15:00</Text>
            </View>
            <View style={classCard.lower}>
                <Text style={cardDesign.calssName}>파이썬 프로젝트</Text>
            </View>
        </View>
      );
    }
  }
  
  export default Contents;