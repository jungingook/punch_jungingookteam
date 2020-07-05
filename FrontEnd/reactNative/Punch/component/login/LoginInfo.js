// 리엑트 모듈
import React, { Component } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, TextInput,Image, Button } from 'react-native';
// [redux]를 통한 데이터 통신
import Constants from 'expo-constants';
import {connect} from 'react-redux'

const layout = StyleSheet.create({
    main : {
        flex : 1,
        backgroundColor :'#FF1E26',
    },
    logoZone : {
        height : '40%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo : {
        margin : 'auto',
        height : '50%',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode:'contain'
    },
    textZone : {
        height : '30%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    mainText : {
        width : 300,
        color : '#ffffff',
        fontSize : 30,
        fontWeight : 'bold',
        margin :  10,
        textAlign : 'left'
    },
    infoText :{
        width : 300,
        color : '#ffffff',
        fontSize : 20,
        fontWeight : 'bold',
        margin :  10,
        textAlign : 'left'
    },
    deviceButton : {
        width : 300,
        height : 50,
        borderRadius :10,   
        margin :  10,
        borderWidth: 1,
        borderColor : '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        // ...Platform.select({ 
        // ios: { 
        //     shadowColor: '#777777',
        //     shadowOffset: { width: 2, height: 2, },
        //     shadowOpacity: 0.6, shadowRadius: 4, 
        //     },
        // android: { elevation: 8, },
        // web:{
            
        // }
        // }), 
    },
    loginButtonText : {
        color : "#ffffff",
        fontSize : 20,
    },
    options:{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection : 'row',
    }
});

class LoginInfo extends Component {

    state = {
        deviceId : false
    };
    
    componentDidMount(){
        // this.setState({
        //     deviceId : Expo.Constants.deviceId
        // })

    }

    render() {
        
      return (
        <View style={layout.main}>
            <View style={layout.logoZone}>
                <Image source={require('../../assets/logoW.png')} style={layout.logo}/>
            </View>
            <View style={layout.textZone}>
            <Text style={layout.mainText}>환영합니다</Text>
            <Text style={layout.infoText}>펀치에서는 부정 출석체크 방지를 위해서 디바이스 정보를 저장하고 있습니다.</Text>
            <Text style={layout.infoText}>해당 디바이스를 통해서 출석체크를 진행하시겠습니까?</Text>
            {/* <Text style={layout.infoText}>기기 id 값 : {this.state.deviceId}</Text> */}
            {/* 로그인버튼 */}
            <TouchableOpacity style={layout.deviceButton} onPress={()=> this.props.appMode('NORMAL')}><Text style={layout.loginButtonText}> 네 이 디바이스를 등록합니다. </Text></TouchableOpacity>
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
        appMode : (mode) => dispatch({type:'AppMode',mode:mode}),
      }
  }
    
  export default connect(mapStateToProps,mapDispatchToProps)(LoginInfo); 
