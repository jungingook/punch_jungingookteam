// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Button, BackHandler } from 'react-native';

// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'
// [ajax] axios 연결
import axios from 'axios';
import ClassAttend from './ClassAttend'; // 하나의 회차의 출석정보를 담는 컴포넌트 
const layout = StyleSheet.create({
    header : {
        width : "100%",
    },
    headerUpper :{
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
    timeZone : {
      paddingTop : 10,
      paddingLeft : '5%'
    },
    timeText : {
      color : '#fff',
      fontSize : 20,
      fontWeight : 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: 0, height: 0},
      textShadowRadius: 3
    },
    professorZone: {
      paddingTop : 10,
      paddingRight : '5%'
    },
    professorText: {
      color : '#fff',
      fontSize : 20,
      fontWeight : 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: 0, height: 0},
      textShadowRadius: 3
    },
    title : {
      paddingRight : '5%',
      paddingLeft : '5%',
      paddingTop : 10,
    },
    titleText : {
      color : '#fff',
      fontSize : 30,
      fontWeight : 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: 0, height: 0},
      textShadowRadius: 3
    },
    state:{
        flexDirection : 'row',
        paddingTop : 10,
        paddingBottom : 10,
        paddingRight : '5%',
        paddingLeft : '5%'
    },
    stateText : {
      color : '#fff',
      fontSize : 20,
      fontWeight : 'bold',
      // textShadowColor: 'rgba(0, 0, 0, 0.75)',
      // textShadowOffset: {width: 0, height: 0},
      // textShadowRadius: 3
    },
    tardybox : {
      flex : 1,
      flexDirection : 'row',
      justifyContent : 'space-around',
      alignItems : 'center',
    },
    tardyView : {  }, 
    attend:{
      marginRight : '2%',
      padding : 5,
      borderRadius : 5,
      backgroundColor : 'rgb(153, 197, 86)',
    },
    tardy : {
      marginRight : '2%',
      padding : 5,
      borderRadius : 5,
      backgroundColor : 'orange',
    },
    absent:{
      marginRight : '2%',
      padding : 5,
      borderRadius : 5,
      backgroundColor : 'red',
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
    footerButton : {
      // borderBottomWidth : 5,
      // borderColor : '#fff'
    },
    footerButtonText : {
      color : '#fff',
      fontSize : 20,
      fontWeight : 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: 0, height: 0},
      textShadowRadius: 3
    }
    
  });


class ClassInfo extends Component {

  state = {
    attendList : 'load',
  }

    // 이벤트 등록
  componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  // 이벤트 해제
  componentWillUnmount() {
      this.exitApp = false;
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  // 이벤트 동작
  handleBackButton = () => {
      this.props.appMode('NORMAL')
      return true;
  }

  date = (day,startTime,endTime) => {
    let weekday = new Array();
    weekday[0]="일요일"; weekday[1]="월요일"; weekday[2]="화요일"; weekday[3]="수요일"; weekday[4]="목요일"; weekday[5]="금요일"; weekday[6]="토요일";
    return weekday[day] +" "+ Math.floor(startTime/60) + " : " + (startTime%60<10? "0"  +startTime%60 : startTime%60 )+ " ~ " + Math.floor((startTime+endTime)/60) + " : " + ((startTime+endTime)%60<10? "0"  +(startTime+endTime)%60 : (startTime+endTime)%60 )
  }

  attendList = () => {
    console.log('토큰 :',this.props.token)
    axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/mobile/student/class/attendance?token='+this.props.token, {
      classListID : this.props.selectCard.id
    }, { credentials: true })
    .then( response => {
        console.log('성공 : ',response.data)
        console.log('데이터리스트 : ',response.data.result)
        this.setState({
          attendList : response.data.result
        },console.log('set  : ',this.state.attendList))
    })
    .catch( error => {
        console.log('실패 : ',error)
    })
  } 

  render() {
    (this.state.attendList == 'load' ? this.attendList() :'')
    console.log('set2  : ',this.state.attendList)
    let cardColor = this.props.cardColor["default"]
    let bgColor={backgroundColor:cardColor[0]}
    let titleColor ={backgroundColor:cardColor[1]}
    let timeID = 0 

    // 다중 수업시간 처리 
    let classTimeText = this.props.selectCard.classTime.map(
      info => (<Text style={layout.timeText} key={timeID++}>{this.date(info.day,info.startTime,info.endTime)}</Text>)   
    );
    // 수업리스트
    let attendList = <View></View>
    if (this.state.attendList != 'load') {
      attendList = this.state.attendList.map(
        info => ( <ClassAttend key={info.week_id} info={info}></ClassAttend>)    
      );
    }
    try {
      cardColor = this.props.cardColor[this.props.selectCard.color]
      bgColor={backgroundColor:cardColor[0]}
      titleColor ={backgroundColor:cardColor[1]}
    } catch (e) {
    }
    return (
      <View style={[bgColor,{flex: 1 }]}>
          <View style={[layout.header,titleColor]}>
              <View style={layout.headerUpper}>
                  <View style={layout.timeZone}>
                    {classTimeText}
                  </View>
                  <View style={layout.professorZone}>
                      <Text style={layout.professorText}>{this.props.selectCard.professor}</Text>
                  </View>
              </View>
              <View style={layout.title}>
                      <Text style={layout.titleText}>{this.props.selectCard.name}</Text>
              </View>
              <View style={layout.state}>
                {(this.props.selectCard.attend_count > 0 ? <View style={layout.attend}><Text style={layout.stateText}>출석 {this.props.selectCard.attend_count}회</Text></View> : <View></View>)}
                {(this.props.selectCard.late_count > 0 ? <View style={layout.tardy}><Text style={layout.stateText}>지각 {this.props.selectCard.late_count}회</Text></View> : <View></View>)}
                {(this.props.selectCard.absent_count > 0 ? <View style={layout.absent}><Text style={layout.stateText}>결석 {this.props.selectCard.absent_count}회</Text></View> : <View></View>)}
              </View>
          </View>
          <ScrollView style={layout.contents}>
            <View style={layout.box}>
              <View>
              <Text>수업 정책</Text>
              </View>
              <View style={layout.tardybox}>
                <View><Text>시작시간</Text></View>
                <View style={layout.tardybox}>
                  <View></View>
                  <View></View>
                  <View></View>
                </View>
                <View><Text>종료시간</Text></View>
              </View>
            </View>
            {attendList}
          </ScrollView>
          <View style={[layout.footer,titleColor]}>
            <TouchableOpacity style={layout.footerButton} onPress={()=>this.handleBackButton()} ><Text style={layout.footerButtonText}>출석 보기</Text></TouchableOpacity>
            <TouchableOpacity style={layout.footerButton}><Text style={layout.footerButtonText}>메시지</Text></TouchableOpacity>
          </View>
      </View>

    );
  }
}
  function mapStateToProps (state){
    return {
      token: state.jwtToken,
      selectCard: state.selectCard,
      cardColor : state.cardColor,
    }
  }
  
  function mapDispatchToProps(dispatch){
      return {
        appMode : (mode) => dispatch({type:'AppMode',mode:mode}),
        classListRefresh : (bool) => dispatch({type:'ClassListRefresh',value:bool}),
        tokenRefresh : (token) => dispatch({type:'TokenRefresh',token:token}),
      }
  }
    
  export default connect(mapStateToProps,mapDispatchToProps)(ClassInfo); 