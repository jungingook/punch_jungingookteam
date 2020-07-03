// 리엑트 모듈
import React, { Component } from 'react';
import { TouchableOpacity, AsyncStorage, Text, View, StyleSheet, TextInput,Image, Alert, Button } from 'react-native';
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'
// [ajax] axios 연결
import axios from 'axios';


const layout = StyleSheet.create({
    main : {
        flex : 1,
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
    loginZone : {
        height : '30%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    inputID : {
        width : 300,
        height : 50,
        borderRadius :10,
        borderColor: "#D9D9D9",
        borderWidth: 2,
        margin :  10,
        backgroundColor : '#F2F2F2',
        textAlign : 'center'
    },
    inputPW :{
        width : 300,
        height : 50,
        borderRadius :10,
        borderColor: "#D9D9D9",
        borderWidth: 2,
        margin :  10,
        backgroundColor : '#F2F2F2',
        textAlign : 'center'
    },
    loginButton : {
        width : 300,
        height : 50,
        borderRadius :10,   
        margin :  10,
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : '#FF1E26',
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
        width : 300,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection : 'row',
    }
});

class Login extends Component {

    state = {
        id : 's1id',
        password : 's1pw',
    };

    idInput = text => {
        this.setState({
            id : text,
        })

    }
    pwInput = text => {
        this.setState({
            password : text,
        })
    }
    _storeData = async () => {
        try {
        //   await AsyncStorage.setItem('userId',this.state.id);
        //   await AsyncStorage.setItem('userPw',this.state.pw);
        } catch (error) {
          // Error saving data
        }
      };
    
    login = () => {
    // console.log('수업이름 : ',this.state.className,'수업요일 : ',this.state.backClassTimeList[0].day,'수업시간 : ',this.state.backClassTimeList[0].startTime,'~',this.state.backClassTimeList[0].endTime,'수업 컬러  : ',this.state.classColor,'수업디자인 : ',this.state.classDesign,)
    // 임시로 다중 시간을 입력하지 않고 입력된 첫 시간만 보냄 
    axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/account/student/login?token='+this.props.token, {
        inputId: this.state.id,
        inputPw : this.state.password,
    }, { credentials: true })
    .then( response => {
        console.log('성공 : ',response.data)
        this.props.loginSuccess(response.data.token)
        this.props.appMode('LOGININFO')
        console.log(this.props.AppMode)
        // AsyncStorage.setItem('userId',this.state.id);
        // AsyncStorage.setItem('userPw',this.state.pw);

    })
    .catch( error => {
        console.log('실패 : ',error)
        Alert.alert(
            '로그인 오류',
            '아이디 혹은 비밀번호가 잘못되었습니다.',
            [
              { text: '돌아가기'}
            ],
            { cancelable: false }
          );
        this.setState({
            password : ''
        })
    })
        // 
    } 

    // _retrieveData = async () => {
    //     try {
    //       const userId = AsyncStorage.getItem('userId');
    //       const userPw = AsyncStorage.getItem('userPw');
    //       if (userId !== null &&userPw !== null  ) {
    //         // We have data!!
    //         console.log('저장된 id : [',userId,'] 저장된 pw : [',userPw,']');
    //       }
    //     } catch (error) {
    //         console.log('저장된 아이디를 불러오지 못함');
    //     }
    //   };
      
    // componentDidMount(){
    //     _retrieveData()
    // }

    render() {
      return (
        <View style={layout.main}>
            <View style={layout.logoZone}>
                <Image source={require('../../assets/logo.png')} style={layout.logo}/>
            </View>
            <View style={layout.loginZone}>
            <TextInput
            style={layout.inputID}
            underlineColorAndroid="transparent"
            placeholder="아이디"
            placeholderTextColor="#999"
            autoCapitalize="none"
            onChangeText={this.idInput}
            />
            <TextInput
            style={layout.inputPW}
            underlineColorAndroid="transparent"
            placeholder="비밀번호"
            placeholderTextColor="#999"
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={this.pwInput}
            />
            {/* 로그인버튼 */}
            <TouchableOpacity style={layout.loginButton} onPress={()=> this.login()}><Text style={layout.loginButtonText}>로그인</Text></TouchableOpacity>
            <View style={layout.options}>
            {/*  회원가입 */}
            <TouchableOpacity onPress={()=> this.props.appMode('NORMAL')}><Text>회원가입</Text></TouchableOpacity>
            {/*  아이디 비밀번호 찾기 */}
            <TouchableOpacity onPress={()=> this.props.appMode('NORMAL')}><Text>아이디/비밀번호 찾기</Text></TouchableOpacity>
            </View>
            </View>
        </View>
      );
    }
  }
  function mapStateToProps (state){
    return {
        token: state.jwtToken,
        AppMode: state.AppMode
    }
  }

  function mapDispatchToProps(dispatch){
      return {
        loginSuccess : (token) => dispatch({type:'LOGINSUCCESS',token:token}),
        appMode : (mode) => dispatch({type:'AppMode',mode:mode}),
      }
  }
    
  export default connect(mapStateToProps,mapDispatchToProps)(Login); 
