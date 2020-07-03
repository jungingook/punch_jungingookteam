// 모듈 연결
import React, { Component, useState, useEffect } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../../store";
// [ajax] axios 연결
import axios from 'axios';
// 컴포넌트 연결

var QRCodeMaker = require('qrcode.react');
class QRcode extends Component {
    state = {
        qrCode: "0000",
        classCode : "-1",
        qrColor : "#000000"
    }

    date = (day,startTime,endTime) => {
        let weekday = new Array();
        
        weekday[0]="일요일"; weekday[1]="월요일"; weekday[2]="화요일"; weekday[3]="수요일"; weekday[4]="목요일"; weekday[5]="금요일"; weekday[6]="토요일";
        return weekday[day] +" "+ Math.floor(startTime/60) + " : " + (startTime%60<10? "0"  +startTime%60 : startTime%60 )+ " ~ " + Math.floor((startTime+endTime)/60) + " : " + ((startTime+endTime)%60<10? "0"  +(startTime+endTime)%60 : (startTime+endTime)%60 )
    }
    startTime = (startTime) => {
        return Math.floor(startTime/60) + ":" + (startTime%60<10? "0"  +startTime%60 : startTime%60 )
    }
    sortTime = (mode,Hours,Minutes) =>{
        let Min  = Minutes<10?"0"+Minutes : Minutes
        let Hour 
        if (mode==12){
            Hours>12? Hour = Hours-12 : Hour = Hours-0
            return (Hours>12?"오후" : "오전") +" "+(Hour<10? "0"+Hour : Hour) + ":" + Min
        }
        if (mode==24){
            
        }
    }
    qrChange = () => {
        let random = "1111"
        // console.log('클래스 아이디 : ',this.props.select.id)
        axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/qr/desk?token='+this.props.token,{
            classListId : this.props.select.id
        })
        .then( response => {
            console.log(response.data.randomNum);
            random = response.data.randomNum;
            console.log(random);
            this.setState({
                qrCode: random,
                classCode : this.props.select.code,
              });
        })
        .catch( error => {
            console.log(error);
        });
    }
    
    componentWillMount() {
         let qrInterval = setInterval(this.qrChange, 1000, "1초 간격")
         this.setState({
            Interval : qrInterval
         },)

      }
      componentWillUnmount(){
        clearInterval(this.state.Interval)
        console.log('인터벌 헤제')
      }

    
    render() {
        let d = new Date();
        let textColor={Color:this.state.qrColor}

        return (
        <div id = "qr">
            <div id = "ClassTimer" style={{color:(this.props.select.color == "black"? "#FFFFFF":"#000000")}}>{this.sortTime(12,d.getHours(),d.getMinutes())}</div>
            <QRCodeMaker id="temp" value={this.state.qrCode} renderAs="canvas" size="1000" bgColor="#ffffff00" fgColor={(this.props.select.color == "black"? "#FFFFFF":"#000000")}/>
            {/* size = 숫자 넣으면 에러가 뜨나 작동은 정상적으로 됨  */}
            <div id="tempClass" style={{color:(this.props.select.color == "black"? "#FFFFFF":"#000000")}}> 
            앱을 통해 출석 체크 하세요
            </div>
            <a id ="windowProgram" href="Punch://"></a>
        </div>
        );
    }
}
//export default Panel;
function mapDispatchToProps(dispatch){
    return {
        loginSuccess : (token) => dispatch({type:'LOGINSUCCESS',jwt : token}),
    }
}

const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard,
    token :  state.jwtToken
  })

export default connect(mapStateToProps,mapDispatchToProps)(QRcode);


