// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";
// [ajax] axios 연결
import axios from 'axios';

// 컴포넌트 연결

class AttendanceUser extends Component {

    state = {
        display : true,
        studentState : this.props.student.studentState,
        statePanel: 'normal',
        userChange : false,
        userScan : this.props.student.is_verified
        // normal = 정상, change = 출석체크 변경, warning = 비정상 출석체크, 

    }
    studentStateChange = (state)=> {
        console.log('상태변경 : ',state)
        axios.put('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/classList/attendance?token='+this.props.token,{
            att_id : this.props.student.attendance_id,
            record : state,
            reason : "수업 진행중 수동으로 수정됨"
        }, { credentials: true })
        .then( response => {
            if(!response.data.error){
                this.setState({
                    studentState : state,
                    userChange : true,
                    userScan : 1,
                })
            }else{
                this.props.logout()
            }
        })
        .catch( error => {
            console.log('출석 리스트 에러 ',error)   
            })  

    }

    statePanelChange = (mode)=> {
        this.setState({
            statePanel : mode,
        })
    }
    componentDidUpdate(){

        if(this.state.userScan!= this.props.student.is_verified&&!this.state.userChange){  // 출석 미출석 여부 확인 
            this.setState({
                userScan : this.props.student.is_verified,
                studentState : this.props.student.studentState
            })
        }
       if(this.state.studentState!= this.props.student.studentState&&!this.state.userChange ){  // 출석인 경우 상태표시
            this.setState({
                studentState : this.props.student.studentState
            })
        }

    }
    

    render() {
        //출석 종류에 따른 색상정하기
        let bgcolor = { 미출석 : {backgroundColor : '#8e2de2',width: '20%'}, 출석 : {backgroundColor : 'rgb(153, 197, 86)',width: '20%'},지각 : {backgroundColor : 'orange',width: '20%'},결석 : {backgroundColor : 'red',width: '20%'} }
        // 경고& 상태 표시 여부
        let studentState
        if(this.state.statePanel == 'normal'){
            studentState = <div onClick={()=>this.statePanelChange('change')} className="statePanelNormal" style={bgcolor[(this.state.userScan?this.state.studentState:'미출석')] }>{this.state.userScan?this.state.studentState:'미출석'}</div>
        }else if(this.state.statePanel == 'change') {
            studentState = <div onClick={()=>this.statePanelChange('normal')} className="statePanelChange" style={{backgroundColor : '#f5f5f5',width: '80%'}}>  
            <span> 출석 상태 변경 </span>
            <div onClick={()=>this.studentStateChange('출석')} style={this.state.studentState == '출석' ? bgcolor['출석'] : {backgroundColor : '#d9d9d9',width: '20%'}}>출석</div>
            <div onClick={()=>this.studentStateChange('지각')} style={this.state.studentState == '지각' ? bgcolor['지각'] : {backgroundColor : '#d9d9d9',width: '20%'}}>지각</div>
            <div onClick={()=>this.studentStateChange('결석')} style={this.state.studentState == '결석' && this.state.userScan ? bgcolor['결석'] : {backgroundColor : '#d9d9d9',width: '20%'}}>결석</div>
            </div>
        }else if(this.state.statePanel == 'warning') {
            studentState = <div onClick={()=>this.statePanelChange('change')} className="statePanelWarning" style={{backgroundColor : '#FF4B2B',background : 'linear-gradient(to right, #FF4B2B, #FF416C)' ,width: '60%',height: '50px'}}> <span>비정상 출석체크 감지</span> <br/>여기를 눌러 출석체크를 해주세요 </div>
        }

        return (

            <div className ="studentAttendObj"  style={(this.props.show?{margin : '5px auto', filter: 'opacity(100%)', animationDelay:this.props.appear*0.3+'s', order : this.props.order}:{margin : '0px auto', animationDelay:this.props.appear*0.3+'s', filter: 'opacity(0%)'})}> 
            <div className = "studentAttend" style={(this.props.show?{height : '50px'}:{height : '0px'})}> 
                <div className = "studentAttendInfo" >
                <div className = "studentAttendName">{this.props.student.name}</div> <div className = "studentAttendNo">{this.props.student.studentNo}</div>
                </div>
                <div className = "studentAttendState" style={(this.props.show?{height : '50px'}:{height : '0px'})}>
                {studentState} 
                </div>
            </div>
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
        logout : () => dispatch({type:'LOGOUT'}),
    }
}
export default connect(mapStateToProps)(AttendanceUser);
