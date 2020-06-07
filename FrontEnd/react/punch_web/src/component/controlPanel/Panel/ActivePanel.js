// 모듈 연결
import React, { Component , Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../../store";
// [ajax] axios 연결
import axios from 'axios';
// 컴포넌트 연결
// 컴포넌트 연결
import SelectPanel from './SelectPanel'; // 선택메뉴
import QRreade from './QRreade'; // 출석체크 선택메뉴
import WeekPanel from './WeekPanel'; // 출석체크 이어하기 여부
import QRactive from './QRactive'; // QR코드 체크

import ClassDelete from './ClassDelete'; // QR코드 체크
import AttendanceCheck from './AttendanceCheck'; // QR코드 체크

class ActivePanel extends Component {
    
    state = {
        titlePanelSetting : false, // 수업의 숫자
        cardNo : null,
        week : null,
        intervalTime : null,
        lastTime : null,
        panelSize : {height:'70vh'},
    }

    titlePanelSettingClick = () =>{
        if (this.state.titlePanelSetting){
            this.setState({
                titlePanelSetting : false
            })
        } else{
            this.setState({
                titlePanelSetting : true
            })          
        }
    }
    classDeleteClick = () => {
        this.props.classDelete()
    }

    classModifyClick = () => {

    }

    nearClassTime (classTime,mode='all'){
        let now = new Date
        let result
        let nearTime = null
        let near = Infinity
        let nowTime = now.getHours()*60+now.getMinutes()

        // 오늘과 같은 요일을 찾아 해당하는 객체만 리턴해준다.
        result = classTime.filter(list =>( list.day == now.getDay()))
        
        // 지금 시간과 가장 가까운 수업을 찾는다. 단 이미 지나간 수업은 찾지 않는다.
        for (let index = 0; index < result.length; index++) {
            let classTime = result[index].startTime+result[index].endTime
            if(classTime-nowTime > 0 ){
                if(near > classTime-nowTime){
                    near = classTime-nowTime
                    nearTime = index
                    // console.log(near,'인덱스 : ',index)
                }
            }
        }

        // 만약 오늘 지금 시간 이후에 있는 수업이 있다면 리턴해준다.
        if (nearTime != null){ 
            return result[nearTime]
        }

        // 내일부터 다음주 같은 요일을 찾아 해당하는 객체만 리턴해준다.
        for (let day = 0; day < 7; day++) {
            result = classTime.filter(list =>( list.day == (now.getDay()+day+1>6 ?(now.getDay()+day+1)-7: now.getDay()+day+1)))
            if (result.length > 0 )break;
        }
        
        // 가장 빠른 수업을 찾는다.
        near = Infinity
        for (let index = 0; index < result.length; index++) {
            let classTime = result[index].startTime+result[index].endTime
            if(near > classTime-nowTime){
                near = classTime-nowTime
                nearTime = index
                // console.log(near,'인덱스 : ',index)
            }
        }
        return result[nearTime]
    }

    date = (classTime) => {
        let nowTime = this.nearClassTime(classTime);
        let weekday = new Array();
        weekday[0]="일요일"; weekday[1]="월요일"; weekday[2]="화요일"; weekday[3]="수요일"; weekday[4]="목요일"; weekday[5]="금요일"; weekday[6]="토요일";
        return weekday[nowTime.day] +" "+ Math.floor(nowTime.startTime/60) + " : " + (nowTime.startTime%60<10? "0"  +nowTime.startTime%60 : nowTime.startTime%60 )+ " ~ " + Math.floor((nowTime.startTime+nowTime.endTime)/60) + " : " + ((nowTime.startTime+nowTime.endTime)%60<10? "0"  +(nowTime.startTime+nowTime.endTime)%60 : (nowTime.startTime+nowTime.endTime)%60 )
    }

    // 패널안의 내용을 mode 에 따라 정합니다.
    panel = (mode) => {
        let output = <div>오류 : 패널의 mode가 없음</div>
        let panelsize = '70vh'
        if (mode == "Error") {
            output = <div>오류 : 패널의 mode가 없음</div>
        }
        else if (mode == "Select") {
            output = <SelectPanel color={this.props.select.color} intervalTime={this.state.intervalTime} />
        }
        else if (mode == "Week" ) {
            output = <WeekPanel select={this.props.select} week={this.state.week} lastTime ={this.state.lastTime}/>
        }
        else if (mode == "QRreade") {
            output = <QRreade select={this.props.select} week={this.state.week}/>
        }
        else if (mode == "QRactive") {
            panelsize = '20vh'
            output = <QRactive select={this.props.select} week={this.state.week}/> 
            // this.props.addOn('QRactiveList') 
        }
        else if (mode == "ClassDelete") {
            output = <ClassDelete select={this.props.select}/>
        }
        else if (mode == "AttendanceCheck") {
            output = <AttendanceCheck select={this.props.select}/>
        }
        else if (mode == "AttendanceWeek") {
            output = <AttendanceCheck select={this.props.select}/>
        }

        return {component : output, size : {height:panelsize} }
    }

    weekfind = () => {
        axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/classList/qr/preOpen?token='+this.props.token, {
            class_id: this.props.select.id,
        })
        .then( response => {
            if (response.message == "잘못된 토큰이 왔습니다."){
                this.setState({
                    week : false
                })
                return
            }
            console.log(response.data)
            let now = new Date();
            console.log('마지막 수업으로 부터 지난 시간1 :',this.nearClassTime(this.props.select.classTime).endTime-Math.floor((now.getTime() - response.data.getTime)/60000))
            this.setState({
                week : response.data.week,
                intervalTime : this.nearClassTime(this.props.select.classTime).endTime-Math.floor((now.getTime() - response.data.getTime)/60000),
                lastTime : Math.floor((now.getTime() - response.data.getTime)/60000)
            })
            this.props.loginSuccess(response.data.token)
            
        })
        .catch( error => {
            console.log(error)
            this.setState({
                week : false,
                intervalTime : null,
                lastTime : null,
            })
        })
    }

    render() { 
        
        let panel = this.panel(this.props.panelMode)


        if(this.props.select.id != this.state.cardNo){
            this.setState({
                cardNo : this.props.select.id,
                titlePanelSetting : false,
            })
            this.weekfind()
        }
        return (
            <div id = "PanelBox" style={panel.size}>
                <div id = "TitlePanel">
                    <div id="TitlePanelUpper" >
                        <div id="TitlePanelTime">
                            <div id="TitlePaneNowlTime">{this.date(this.props.select.classTime)}</div> {this.props.select.classTime.length > 1 ? <div id="allTimeShow">모든 시간 보기</div> : ''}
                        </div>
                        <div id="TitlePanelSetting">
                            <div id="TitlePanelSettingMenu"> 
                                <div id="TitlePanelSettingButton" className={(this.state.titlePanelSetting? 'TitlePanelSettingButtonL' : 'TitlePanelSettingButtonS' )} onClick ={() =>this.titlePanelSettingClick()}/>
                                {(this.state.titlePanelSetting? <div id="TitlePanelHideButton" onClick = {this.classDeleteClick}>숨기기</div> : '' )} 
                                {(this.state.titlePanelSetting? <div id="TitlePanelClassModifyButton" onClick = {this.classDeleteClick}>수정</div> : '' )} 
                                {(this.state.titlePanelSetting? <div id="TitlePanelDeleteButton" onClick = {this.classDeleteClick}>삭제</div> : '' )} 
                            </div>
                        </div>
                    </div>
                    <div id = "TitlePanelName">
                        {this.props.select.name}
                    </div>
                </div>
                <div id = "PanelField">
                    {panel.component}
                </div>
            </div>
        );
    }
}
//export default Panel;

function mapDispatchToProps(dispatch){
    return {
      classDelete : () => dispatch({ type: "panelMode",panelMode : "ClassDelete"}),
      loginSuccess : (token) => dispatch({type:'LOGINSUCCESS',jwt : token}),
    }
  }
const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard,
    panelMode : state.panelMode,
    token :  state.jwtToken,
  })

export default connect(mapStateToProps,mapDispatchToProps)(ActivePanel);
