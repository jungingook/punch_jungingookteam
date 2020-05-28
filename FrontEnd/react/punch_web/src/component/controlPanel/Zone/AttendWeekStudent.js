// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";

// 컴포넌트 연결
import QRcode from './QRcode'; // 큐알코드 생성 

class AttendWeekStudent extends Component {

    state = {
        display : true,
        expansion : false,
        stateChange : false,
        studentState : '출석'
    }
    
    more = (value) =>  {
        this.setState({
            expansion : !value 
        })
    }
    stateChangeView = (value) =>  {
        this.setState({
            stateChange : !value,
        },console.log(value))
    }
    stateChange = (state=this.state.studentState) =>  {
        this.setState({
            studentState : state
        },console.log(state))
    }

    render() {
        let bgcolor = { 출석 : {backgroundColor : 'rgb(153, 197, 86)'},지각 : {backgroundColor : 'orange'},결석 : {backgroundColor : 'red'} }
        console.log(this.props.name,':',this.props.order,)
        return (
            <div className = "AttendWeekStudentView" style={(this.props.show?{margin : '10px 0', filter: 'opacity(100%)', order : this.props.order}:{margin : '0px', filter: 'opacity(0%)'})}>
                <div className = "AttendWeekStudentDefault" style={(this.props.show?{height : '100px'}:{height : '0px'})}>
                    <div className = "AttendWeekStudentLeft">
                        <div className = "AttendWeekStudentNo"> {this.props.studentNo} </div>
                        <div className = "AttendWeekStudentLeftBottom">
                            <div className = "AttendWeekStudentName"> {this.props.name} </div>
                            {this.state.stateChange ? 
                            <div className = "AttendWeekStudentStateChange" onClick={()=>this.stateChangeView(true)}> <span className ="StateChangeAttend" onClick={()=>this.stateChange('출석')}> 출석 </span> <span className ="StateChangeTrady" onClick={()=>this.stateChange('지각')}> 지각 </span> <span className ="StateChangeAbsent" onClick={()=>this.stateChange('결석')}> 결석 </span> </div>:
                            <div className = "AttendWeekStudentState" title="클릭해서 출석상태를 변경할 수 있습니다." onClick={()=>this.stateChangeView(false)} style={bgcolor[this.state.studentState]}> {this.state.studentState} <span className = "AttendWeekStudentTime" >{this.props.attendTime}</span></div>
                            }
                        </div>
                    </div>
                    <div className = "AttendWeekStudentRight">
                        <div className = "AttendWeekStudentRightTop">
                        <div className = "AttendWeekStudentInfo AttendFinger" title="QR코드를 통한 출석 체크가 되었습니다"/>
                        <div className = "AttendWeekStudentInfo AttendGPS" title="GPS인증이 되었습니다."/>
                        <div className = "AttendWeekStudentInfo AttendQR" title="지문인식이 되었습니다."/>
                        </div>
                        <div className = "AttendWeekStudentRightBottom">
                            <div className = "AttendWeekStudentMore" onClick={()=>this.more(this.state.expansion)} style= {this.state.expansion ? {transform: 'rotateX(180deg)'}:{transform: 'rotateX(0deg)'}}> ▼ </div>
                        </div>
                    </div>
                </div>
                { this.state.expansion && this.props.show ? 
                 <div className = "AttendWeekStudentExpansion">
                     <div className = "AttendMapLOG">
                        <div className="AttendMap"/>
                    </div>
                    <div className = "AttendLogList">
                        <div className = "AttendLOG"> QR코드를 통해서 출석체크됨 {this.props.attendTime} </div>
                        <div className = "AttendLOG"> QR코드를 통해서 출석체크됨 {this.props.attendTime} </div>
                        <div className = "AttendLOG"> QR코드를 통해서 출석체크됨 {this.props.attendTime} </div>
                    </div>
                     <div>

                     </div>
                </div>               
                
                 :''}

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    attendanceNo : state.attendanceNo,
    panelMode : state.panelMode,
  })

export default connect(mapStateToProps)(AttendWeekStudent);
