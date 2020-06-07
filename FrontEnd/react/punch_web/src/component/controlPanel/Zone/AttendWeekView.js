// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";
// [ajax] axios 연결
import axios from 'axios';

// 컴포넌트 연결
import QRcode from './QRcode'; // 큐알코드 생성 
import AttendWeekStudent from './AttendWeekStudent'; // 학생출석표 생성 

class AttendWeekView extends Component {

    state = {
        attendanceNo : null,
        search : '',
        student :[
        {name :'정인국', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334024, attendTime:'13시 23분 07초'},
        {name :'여은성', studentNo:201334025, attendTime:'13시 23분 07초'},
        {name :'김민혁', studentNo:201334026, attendTime:'13시 23분 07초'},
        {name :'정인식', studentNo:201334027, attendTime:'13시 23분 07초'},
        {name :'정인국', studentNo:201334028, attendTime:'13시 23분 07초'},
        {name :'장성원', studentNo:201334029, attendTime:'13시 23분 07초'},
        {name :'배민환', studentNo:201334030, attendTime:'13시 23분 07초'},
        {name :'한용재', studentNo:201334031, attendTime:'13시 23분 07초'},
        {name :'변민영', studentNo:201334032, attendTime:'13시 23분 07초'},
        {name :'이상민', studentNo:201334033, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334034, attendTime:'13시 23분 07초'},
        {name :'강민성', studentNo:201334035, attendTime:'13시 23분 07초'},
        {name :'김민혁', studentNo:201334036, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334037, attendTime:'13시 23분 07초'},
        {name :'정인국', studentNo:201334038, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334039, attendTime:'13시 23분 07초'},
        {name :'여은성', studentNo:201334040, attendTime:'13시 23분 07초'},
        {name :'김민혁', studentNo:201334041, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334042, attendTime:'13시 23분 07초'},
        ],
        attend: 0,
        tardy : 0,
        absent: 0,

    }

    studentSearch = (e) => {
        this.setState({
            search : e.target.value,
        })
    }

    listUpdata = () => {
        console.log('토큰값 : ','http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/classList/attendance?token='+this.props.token)
        let classList
        axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/classList/attendance?token='+this.props.token,{
            classListID : this.props.select.id,
            att_week : this.props.attendanceNo
        }, { credentials: true })
        .then( response => {
            console.log('출석 리스트 222: ',this.props.attendanceNo,'주차',response.data)
            this.props.loginSuccess(response.data.token)
            this.setState({
                student : response.data.att_arr,
                attend: response.data.attend_count,
                tardy : response.data.late_count,
                absent : response.data.absent_count,
                
            })
        })
        .catch( error => {
            console.log('출석 리스트 에러 ',error)          
            })      
    }
    componentWillMount() {
        this.listUpdata()
        }
    render() {
        let result  
        if (this.state.attendanceNo!=this.props.attendanceNo){
            this.listUpdata()
            this.setState({
                attendanceNo : this.props.attendanceNo,
            })
        }

        if (Number(this.state.search)|| this.state.search =='0'){
            // console.log('학번으로 검색')
            result = this.state.student.filter(s =>((s.studentNo+'').search(this.state.search) != -1))
        }else {
            // console.log('이름으로 검색')
            result = this.state.student.filter(s =>(s.name.search(this.state.search) != -1));
        }
        // console.log('렌더',result)
        let show = result.map(
            info => (info.studentNo)   
        );     
        // console.log('쇼',show)
        console.log('리 렌더링')
        let list = this.state.student.map(
            info => (<AttendWeekStudent key={info.attendance_id} order={info.name.search(this.state.search)} show={(show.indexOf(info.studentNo) == -1 ? false : true )} student={info} />)   
        );          

        return (
      
            <div id = "AttendWeekZone">
                <div id = "AttendWeekInfo">
                    <div id = "AttendWeekInfoTitle"> {this.props.attendanceNo}회차 수업 </div>
                    <div id = "AttendWeekInfoDate"> 2020년 11월 10일 월요일 13:23 </div>
                    <div id = "AttendWeekInfoState"> 
                        <span className="AttendStateAttendance">출석 : {this.state.attend}</span> 
                        <span className="AttendStateTrady">지각 :  {this.state.tardy}</span> 
                        <span className="AttendStateAbsent">결석 :  {this.state.absent}</span>
                    </div>
                </div>
                <div id = "AttendWeekInfoButton">
                    <div className= "AttendInfoinput" > <span>학생 검색 : </span><input placeholder="학번 또는 이름" onChange={this.studentSearch}/> </div>
                    <div className="AttendInfoButton" > 출석자 제외 </div>               
                </div>
                <div  id = "AttendWeekStudentZone">
                    {list}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
        attendanceNo : state.attendanceNo,
        panelMode : state.panelMode,
        token :  state.jwtToken
    })

function mapDispatchToProps(dispatch){
    return {
        loginSuccess : (token) => dispatch({type:'LOGINSUCCESS',jwt : token}),
        }
    }
export default connect(mapStateToProps,mapDispatchToProps)(AttendWeekView);
