// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableHighlight, TouchableOpacity, platform } from 'react-native';
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'


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
});

class QRButton extends Component {

  appView = (mode) => {
    let output = <MainView/>
    if (mode == "NORMAL") {
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
        <View style={layout.attendanceButton} > 
        {/* onPress={()=> this.props.qrButtonPush()} */}
        <TouchableOpacity onPress={()=> this.props.qrButtonPush()} >
        <Image source={require('../../assets/QR.png')} style={{ justifyContent: 'center', alignItems: 'center',width : 70,height : 70,resizeMode:'contain'}}/>
        </TouchableOpacity>
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
        qrButtonPush : () => dispatch({type:'QRSCAN'}),
      }
  }

  export default connect(mapStateToProps,mapDispatchToProps)(QRModal); 