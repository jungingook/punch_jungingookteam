// 모듈 연결
import React, { Component , Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../../store";
// 컴포넌트 연결
import SelectPanel from './SelectPanel'; // 선택메뉴
import QRreade from './QRreade'; // 출석체크 선택메뉴
import QRactive from './QRactive'; // QR코드 체크
import ClassDelete from './ClassDelete'; // QR코드 체크
import AttendanceCheck from './AttendanceCheck'; // QR코드 체크

class ActivePanel extends Component {
    
    state = {
        titlePanelSetting : false, // 수업의 숫자
        cardNo : this.props.select.id
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

    date = (day,startTime,endTime) => {
        let weekday = new Array();
        weekday[0]="일요일"; weekday[1]="월요일"; weekday[2]="화요일"; weekday[3]="수요일"; weekday[4]="목요일"; weekday[5]="금요일"; weekday[6]="토요일";
        return weekday[day] +" "+ Math.floor(startTime/60) + " : " + (startTime%60<10? "0"  +startTime%60 : startTime%60 )+ " ~ " + Math.floor((startTime+endTime)/60) + " : " + ((startTime+endTime)%60<10? "0"  +(startTime+endTime)%60 : (startTime+endTime)%60 )
    }
    componentWillMount() {

    }
    // 패널안의 내용을 mode 에 따라 정합니다.
    panel = (mode) => {
        let output = <div>오류 : 패널의 mode가 없음</div>
        if (mode == "Error") {
            output = <div>오류 : 패널의 mode가 없음</div>
        }
        else if (mode == "Select") {
            output = <SelectPanel color={this.props.select.color}/>
        }
        else if (mode == "QRreade") {
            output = <QRreade select={this.props.select}/>
        }
        else if (mode == "QRactive") {
            output = <QRactive select={this.props.select}/>
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
        return output
    }

    render() { 
        if(this.props.select.id != this.state.cardNo){
            this.setState({
                cardNo : this.props.select.id,
                titlePanelSetting : false,
            })
        }

        return (
            <Fragment>
                <div id = "TitlePanel">
                    <div id="TitlePanelUpper" >
                        <div id="TitlePanelTime">
                            {this.date(this.props.select.day,this.props.select.startTime,this.props.select.endTime)}
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
                    {this.panel(this.props.panelMode)}
                </div>
            </Fragment>
        );
    }
}
//export default Panel;

function mapDispatchToProps(dispatch){
    return {
      classDelete : () => dispatch({ type: "panelMode",panelMode : "ClassDelete"}),
    }
  }
const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard,
    panelMode : state.panelMode,
  })

export default connect(mapStateToProps,mapDispatchToProps)(ActivePanel);
