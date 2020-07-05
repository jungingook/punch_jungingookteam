// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";

// 컴포넌트 연결
import QRcode from './QRcode'; // 큐알코드 생성 

// [ajax] axios 연결
import axios from 'axios';

class AttendWeekStudent extends Component {

    state = {
        display : true,
        expansion : false,
        stateChange : false,
        studentState : this.props.student.studentState
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
        console.log('상태변경 : ',this.props.student.attendance_id,'을 ',state,'으로')
        axios.put('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/classList/attendance?token='+this.props.token,{
            att_id : this.props.student.attendance_id,
            record : state,
            reason : "출결관리를 통해 수동으로 수정됨"
        },)
        .then( response => {
            console.log(response)
            if(!response.data.error){
                console.log('상태변경',state)
                this.setState({
                    studentState : state
                })
                this.props.update()
                this.props.panelRefresh()
            }
        })
        .catch( error => {
            console.log('출석 리스트 에러 ',error)   
            })  
    }

    // attendance_id: 419
    // created_day: "2020-06-13T00:00:00.000Z"
    // created_time: 900
    // is_fingerprint: 0
    // is_gtx: 0
    // is_passive: 0
    // is_qr: 0
    // name: "s1id"
    // studentNo: 201434001
    // studentState: "지각"
    render() {
        let bgcolor = { 출석 : {backgroundColor : 'rgb(153, 197, 86)'},지각 : {backgroundColor : 'orange'},결석 : {backgroundColor : 'red'} }
        return (
            <div className = "AttendWeekStudentView" style={(this.props.show?{margin : '10px 0', filter: 'opacity(100%)', order : this.props.order}:{margin : '0px', filter: 'opacity(0%)'})}>
                <div className = "AttendWeekStudentDefault" style={(this.props.show?{height : '100px'}:{height : '0px'})}>
                    <div className = "AttendWeekStudentLeft">
                        <div className = "AttendWeekStudentkey"> 
                            <div className = "AttendWeekStudentNo"> {this.props.student.studentNo} </div>
                            <div className = "AttendWeekStudentName"> {this.props.student.name} </div>
                        </div>
                        <div className = "AttendWeekStudentLeftBottom">
                            {this.state.stateChange ? 
                            <div className = "AttendWeekStudentStateChange" onClick={()=>this.stateChangeView(true)}> <span className ="StateChangeAttend" onClick={()=>this.stateChange('출석')}> 출석 </span> <span className ="StateChangeTrady" onClick={()=>this.stateChange('지각')}> 지각 </span> <span className ="StateChangeAbsent" onClick={()=>this.stateChange('결석')}> 결석 </span> </div>:
                            <div className = "AttendWeekStudentState" title="클릭해서 출석상태를 변경할 수 있습니다." onClick={()=>this.stateChangeView(false)} style={bgcolor[this.state.studentState]}> {this.state.studentState} <span className = "AttendWeekStudentTime" >{this.props.attendTime}</span></div>
                            }
                        </div>
                    </div>
                    <div className = "AttendWeekStudentRight">
                        <div className = "AttendWeekStudentRightTop">
                        <div className = "AttendWeekStudentInfo AttendFinger" title="QR코드를 통한 출석 체크가 되었습니다"/>
                        {/* <div className = "AttendWeekStudentInfo AttendGPS" title="GPS인증이 되었습니다."/>
                        <div className = "AttendWeekStudentInfo AttendQR" title="지문인식이 되었습니다."/> */}
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
                        <div className = "AttendLOG"> {this.props.student.reason}{this.props.attendTime} </div>
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
    token :  state.jwtToken,
  })
function mapDispatchToProps(dispatch){
return {
    panelRefresh : () => dispatch({type:'attendanceRefresh',refresh : true}),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(AttendWeekStudent);
