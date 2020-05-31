// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Button, BackHandler } from 'react-native';

// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'
// [ajax] axios 연결
import axios from 'axios';

const layout = StyleSheet.create({

    attend:{
        height : 70,
        borderTopRightRadius : 5,
        borderBottomRightRadius : 5,
        backgroundColor : 'rgb(153, 197, 86)',
        paddingRight : '5%',
        paddingLeft : '5%',
        justifyContent : 'center',
        alignItems :'center',
    },
    tardy : {
        height : 70,
        borderTopRightRadius : 5,
        borderBottomRightRadius : 5,
        backgroundColor : 'orange',
        paddingRight : '5%',
        paddingLeft : '5%',
        justifyContent : 'center',
        alignItems :'center',
    },
    absent:{
        height : 70,
        borderTopRightRadius : 5,
        borderBottomRightRadius : 5,
        backgroundColor : 'red',
        paddingRight : '5%',
        paddingLeft : '5%',
        justifyContent : 'center',
        alignItems :'center',
    },
    contents : {
      flex : 1,
      paddingTop : 20,
      paddingBottom : 20,
    },
    box:{
      marginRight : '5%',
      marginLeft : '5%',
      borderRadius : 5,
      backgroundColor : '#FFFEFF', 
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
    list : {
      marginTop : 10,
      marginBottom : 10,
      height : 70,
      flexDirection : 'row',
      justifyContent : 'space-between',
      alignItems : 'center',
    },
    listLeft : {
    paddingRight : '5%',
    paddingLeft : '5%',
    },
    footer : {
      height : 50,
      flexDirection : 'row',
      justifyContent : 'space-around',
      alignItems : 'center'
    },
    date : {
      color : '#777',
      fontSize : 15,
      fontWeight : 'bold',
    },
    week : {
      color : '#555',
      fontSize : 30,
      fontWeight : 'bold',
    },
    stateText : {
        color : '#fff',
        fontSize : 20,
        fontWeight : 'bold',
        // textShadowColor: 'rgba(0, 0, 0, 0.75)',
        // textShadowOffset: {width: 0, height: 0},
        // textShadowRadius: 3
      },
    
  });


class ClassAttend extends Component {

  state = {
    attendList : 'load',
  }
  render() {
      console.log()
    return (
        <View key={this.props.info.week_id} style={[layout.list,layout.box]}>
        <View style={layout.listLeft}>
          <Text style={layout.date}>{this.props.info.createdDay}</Text>
          <Text style={layout.week}>{this.props.info.week_id}주차 수업</Text>
        </View>
        <View style={layout.listRight}>
          {/* <Text>2020년 1월 30일</Text> */}
          {(this.props.info.record == '출석' ? <View style={layout.attend}><Text style={layout.stateText}>출석</Text></View> : <View></View>)}
          {(this.props.info.record == '지각' ? <View style={layout.tardy}><Text style={layout.stateText}>지각</Text></View> : <View></View>)}
          {(this.props.info.record == '결석' ? <View style={layout.absent}><Text style={layout.stateText}>결석</Text></View> : <View></View>)}
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
    
  export default connect(mapStateToProps,mapDispatchToProps)(ClassAttend); 