// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Button } from 'react-native';
// 컴포넌트 연결
import ClassCard from './ClassCard'; // 앱의 메인 화면 구성을 담당하는 컴포넌트
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'
// [ajax] axios 연결
import axios from 'axios';

const layout = StyleSheet.create({
    margin : {
        width : "100%",
        overflow : "scroll",
    },
    lodeingBar : {
      flex : 1,
      justifyContent : 'center',
      alignItems : 'center',
      backgroundColor : '#ccc',
      height : 100,
      marginLeft : '5%',
      marginRight : '5%',
      marginTop : 10,
      marginBottom : 10,
      width : "90%",
      borderRadius : 10,
    },
    lodeingBarFont:{
      fontSize : 20,
      fontWeight : 'bold',
      textAlign : 'center'
    },
    lodeingIndicator : {
      width : "90%",
      marginLeft : '5%' ,
      marginRight : '5%' ,
      height : 200,
    },
    nullIndicator : {
      width : "90%",
      marginLeft : '5%' ,
      marginRight : '5%' ,
      height : 200,
    },
  });


const classCard = StyleSheet.create({
    Layout : {
        width : "90%",
        marginLeft : '5%' ,
        marginRight : '5%' ,
        height : 200,
        flexDirection : "column",
        borderRadius : 10,
        marginTop : 10,
        marginBottom : 10,
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
        // backgroundColor : "#00B0F0",
        borderTopLeftRadius : 10,
        borderTopRightRadius : 10,
        justifyContent : "space-between",
        paddingLeft : '5%',
        paddingRight : '5%',
    },
    lower : {
        flex : 2,
        // backgroundColor : "#009FF0",
        borderBottomLeftRadius : 10,
        borderBottomRightRadius : 10,
        flexDirection : "column",
        justifyContent : "center"
    },
  });

class Contents extends Component {

  state = {
    classList : 'load',
  }

classLoad = () => {
  console.log('수업 목록을 받아옵니다.')
  // console.log('수업이름 : ',this.state.className,'수업요일 : ',this.state.backClassTimeList[0].day,'수업시간 : ',this.state.backClassTimeList[0].startTime,'~',this.state.backClassTimeList[0].endTime,'수업 컬러  : ',this.state.classColor,'수업디자인 : ',this.state.classDesign,)
  // 임시로 다중 시간을 입력하지 않고 입력된 첫 시간만 보냄 
  axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/mobile/student/main?token='+this.props.token,{ credentials: true })
  .then( response => {
      console.log('받은데이터 : ',response)
      this.props.tokenRefresh(response.data.token)
        this.setState({
          classList : response.data.classList
        })
  })
  .catch( error => {
      console.log('실패 : ',error)
      
  })
      // 
  } 
    render() {
      if(this.props.Refresh){
        // 새로고침
        this.props.classListRefresh(false)

        this.classLoad()
      }

      let list
      //  업로드 상태 체크
      console.log(this.state.classList)
      if(this.state.classList == null){
        
        list = <View style={layout.lodeingBar}><Text style={layout.lodeingBarFont}>아래의 QR버튼을 통해{"\n"}QR코드를 스캔해서{"\n"}수업을 등록하세요</Text></View>
      }
      else if(this.state.classList == 'load'){
        list = <View style={layout.lodeingBar}><ActivityIndicator size="large"/></View>
        this.classLoad()
      }
      else{
        list = this.state.classList.map(
          info => (<ClassCard key={info.id} info={info}/>)    
        );   
      }
      return (
        <ScrollView style={layout.margin}> 
            {list}
        </ScrollView>
      );
    }
  }
  function mapStateToProps (state){
    return {
      token: state.jwtToken,
      AppMode: state.AppMode,
      Refresh: state.classListRefresh
    }
  }
  
  function mapDispatchToProps(dispatch){
      return {
        appMode : (mode) => dispatch({type:'AppMode',mode:mode}),
        classListRefresh : (bool) => dispatch({type:'ClassListRefresh',value:bool}),
        tokenRefresh : (token) => dispatch({type:'TokenRefresh',token:token}),
      }
  }
    
  export default connect(mapStateToProps,mapDispatchToProps)(Contents); 