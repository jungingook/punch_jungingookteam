// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableHighlight, TouchableOpacity, platform } from 'react-native';
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'
// 컴포넌트 연결
import QRSanner from '../../QRSanner';

const layout = StyleSheet.create({
    attendanceButton: {
        position: 'absolute', left: '50%', right: 10, bottom: 30,
        borderRadius : 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft : -45,
        height : 90,
        width : 90,
        backgroundColor :"#F6F7F9",
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
    backdrop: {
      position: 'absolute',top:0, left: 0, right: 0, bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      flex : 1,
      backgroundColor :"#00000070",
    },
    qrModal : {
      position: 'absolute', top:'20%', left: 0, right: 0, bottom: 0,
      borderRadius : 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft : '10%' ,
      marginRight : '10%' ,
      height : '60%',
      width : '80%',
      backgroundColor :"#F6F7F9",
      overflow : 'hidden',
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
    qrHeader : {
      flex : 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    qrHeaderFont : {
      fontSize : 20
    },
    qrFooter : {
      flex : 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    qrScanner: {
      borderRadius : 30,
      justifyContent: 'center',
      alignItems: 'center',
      height : '70%',
      width : '90%',
      backgroundColor :"#F6F7F9",
      overflow : 'hidden',
    },
});

class QRModal extends Component {

  state = {
    attend : false 
  }
  
  attendcheck = (value) => {
    console.log(value)
  }

  appView = (mode) => {
    let output = <TouchableOpacity onPress={()=> this.props.appMode('QRSCAN')} ><Image source={require('../../assets/QR.png')} style={{ justifyContent: 'center', alignItems: 'center',width : 70,height : 70,resizeMode:'contain'}}/></TouchableOpacity>
    if (mode == "NORMAL") {
        output = <TouchableOpacity onPress={()=> this.props.appMode('QRSCAN')} ><Image source={require('../../assets/QR.png')} style={{ justifyContent: 'center', alignItems: 'center',width : 70,height : 70,resizeMode:'contain'}}/></TouchableOpacity>
    }
    else if (mode == "QRSCAN") {
          output = <View style={layout.qrModal}><View style={layout.qrHeader}><Text style={layout.qrHeaderFont}>출석체크</Text></View><View style={layout.qrScanner}><QRSanner check={this.attendcheck}/></View><View style={layout.qrHeader}><TouchableOpacity onPress={()=> this.props.appMode('NORMAL')} ><Text>뒤로</Text></TouchableOpacity></View></View>
    }
    else if (mode == "QRATTEND") {
          output = <View style={layout.qrModal}><View style={layout.qrHeader}><Text style={layout.qrHeaderFont}>출석체크</Text></View><View style={layout.qrScanner}><QRSanner/></View><View style={layout.qrHeader}><TouchableOpacity onPress={()=> this.props.appMode('AppMode')} ><Text>뒤로</Text></TouchableOpacity></View></View>
    }
    else if (mode == "QRactive") { 
      
    }
    return output
}
  modalCss= (mode) => {
    let output = layout.attendanceButton
    if (mode == "NORMAL") {
        output = layout.attendanceButton
    }
    else if (mode == "QRSCAN") {
          output = layout.backdrop
    }
    else if (mode == "QRATTEND") {
          output = layout.backdrop
    }
    else if (mode == "QRactive") { 

    }
    return output
  }


    render() {

      return (
        <View style={this.modalCss(this.props.AppMode)} > 
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
        appMode : (mode) => dispatch({type:'AppMode',mode:mode}),
      }
  }

  export default connect(mapStateToProps,mapDispatchToProps)(QRModal); 