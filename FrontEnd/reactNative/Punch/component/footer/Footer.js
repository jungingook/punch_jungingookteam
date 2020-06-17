// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button,TouchableHighlight } from 'react-native';
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'


const layout = StyleSheet.create({
  FooterBar: {
    flex : 1,
    flexDirection: "row",
    justifyContent :"space-between"
  },
  LeftBar:{
    flex : 1,

  },
  RightBar: {
    flex : 1,
  },
  QRbutton: {
    width : 100,
    height : 100,
    backgroundColor : "#ccc",
    borderRadius : 100,
  },
});

class Footer extends Component {
    render() {
      return (
        <View style={layout.attendanceButton}> 
          <Image source={require('../../assets/QR.png')} style={{ justifyContent: 'center', alignItems: 'center',width : 70,height : 70,resizeMode:'contain'}}/>
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

  export default connect(mapStateToProps,mapDispatchToProps)(Footer); 