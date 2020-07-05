// 모듈 연결
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";

// [ajax] axios 연결
import axios from 'axios';


class Progress extends Component {
    
    state = {
        show : true
    }

    date = (startTime) => {
        const date = new Date();
        let weekday = new Array();
        weekday[0]="일요일"; weekday[1]="월요일"; weekday[2]="화요일"; weekday[3]="수요일"; weekday[4]="목요일"; weekday[5]="금요일"; weekday[6]="토요일";
        return " "+ Math.floor(startTime/60) + "시 " + (startTime%60<10? "0"  +startTime%60 : startTime%60 ) + "분 시작 " 
        // + Math.floor((startTime+endTime)/60) + " : " + ((startTime+endTime)%60<10? "0"  +(startTime+endTime)%60 : (startTime+endTime)%60 )
    }

    handle = (classId,classTime,classWeek) => {
        console.log('버튼클릭')
        axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/qr/open?token='+this.props.token, {
            classListId: classId,
            classStartTimeHour : classTime,
            week : classWeek
        })
        .then( response => {
            if (response.message == "잘못된 토큰이 왔습니다."){
                this.logout()
                return
            }
            else {
                this.props.weekSelect(classWeek)
                this.props.selectCard(classId)
                this.props.PanelSelect("QRactive")
            }
        })
        .catch( error => {
            console.log(error)
        })

    }

    componentDidUpdate(){
        
        if (this.props.classRecord){
            console.log(this.props.classRecord.endTime)
            if (!this.state.show) {
                this.setState({
                    show : true
                })
            }
        }else{
            if (this.state.show) {
                this.setState({
                    show : false
                })
            }
        } 
    }
    
    render() {
        let bgColor= {backgroundColor: '#999'}
        let btColor= {backgroundColor: '#999'}
        let className 
        let classTime 
        let classWeek
        let classId
        if (this.props.classRecord){
            console.log(this.props.classRecord)
            bgColor= {backgroundColor: this.props.classRecord.color[0]}
            btColor= {backgroundColor: this.props.classRecord.color[1]}
            className = this.props.classRecord.className
            classId = this.props.classRecord.classId
            classTime = this.props.classRecord.classTime
            classWeek = this.props.classRecord.classWeek
        } 

        return (
            <Fragment>
                {this.state.show?
            <div id = "AddOnProgress"> 
                <div id ="progressClass">
                    <div id ="progressClassLeft">
                        <div id ="progressClassTrue">
                            진행중인 수업이 있습니다.
                        </div>
                        <div id ="progressClassInfo">
                            <div id ="progressClassTitle" style={bgColor}>
                                {className} {classWeek}회차
                            </div>
                            <div id ="progressClassTime">
                                {this.date(classTime)}
                            </div>
                        </div>
                    </div>
                    <div id ="progressClassRight" style={btColor} onClick={() => this.handle(classId,classTime,classWeek) }>
                            바로가기
                    </div>
                </div>  
            </div>
                :''}
            </Fragment>
            
        );
    }
}

const mapStateToProps = (state) => ({
    panelMode : state.panelMode,
    classList : state.classList,
    selectCard : state.selectCard,
    cardColor : state.cardColor,
    token :  state.jwtToken,
    qrCreactWeek :  state.qrCreactWeek,
    classRecord : state.classRecord
  })
function mapDispatchToProps(dispatch){
    return {
        loginSuccess : (token) => dispatch({type:'LOGINSUCCESS',jwt : token}),
        logout : () => dispatch({type:'LOGOUT'}),
        PanelSelect : (mode) => dispatch({ type: "panelMode",panelMode :mode,force:true}),
        selectCard : (id) => dispatch({ type: "selectCard",id :id}),
        weekSelect : (week) => dispatch({ type: "WEEKSLECET",week}),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Progress);