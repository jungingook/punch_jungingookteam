// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../store";
// [ajax] axios 연결
import axios from 'axios';
// 컴포넌트 연결

var QRCodeMaker = require('qrcode.react');
class QRcode extends Component {
    state = {
        qrCode: "0000",
        classCode : "-1",
    }

    date = (day,startTime,endTime) => {
        let weekday = new Array();
        
        weekday[0]="일요일"; weekday[1]="월요일"; weekday[2]="화요일"; weekday[3]="수요일"; weekday[4]="목요일"; weekday[5]="금요일"; weekday[6]="토요일";
        return weekday[day] +" "+ Math.floor(startTime/60) + " : " + (startTime%60<10? "0"  +startTime%60 : startTime%60 )+ " ~ " + Math.floor((startTime+endTime)/60) + " : " + ((startTime+endTime)%60<10? "0"  +(startTime+endTime)%60 : (startTime+endTime)%60 )
    }
    startTime = (startTime) => {
        return Math.floor(startTime/60) + ":" + (startTime%60<10? "0"  +startTime%60 : startTime%60 )
    }
    qrChange = () => {
        let random
        console.log()
        axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/qr')
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
        setInterval(this.qrChange, 1000, "1초 간격")
      }
    render() {
        let d = new Date();
        let test = "오후"+d.getHours()+":"+(d.getMinutes());
        return (
        <div id = "qr">
            <div id = "ClassTimer">{test}</div>
            <QRCodeMaker id="temp" value={this.state.qrCode+this.props.select.code} renderAs="canvas" size="1000" bgColor="#ffffff00" fgColor="#000000"/>
            {/* size = 숫자 넣으면 에러가 뜨나 작동은 정상적으로 됨  */}
            <div id="tempClass"> 
            앱을 통해 출석 체크 하세요
            </div>
        </div>
        );
    }
}
//export default Panel;
const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard
  })

export default connect(mapStateToProps)(QRcode);


