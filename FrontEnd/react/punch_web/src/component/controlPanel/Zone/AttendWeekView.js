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

        ],
        error : false,
        attend: 0,
        tardy : 0,
        absent: 0,
        classTime : '수업시간을 불러오는중 입니다.',
        tokenCheck : this.props.token
    }

    studentSearch = (e) => {
        this.setState({
            search : e.target.value,
        })
    }
    logout = (error) =>{
        if(error){
            this.props.logout()
        }
    }   
    listUpdata = () => {
        let classList
        console.log(this.props.attendanceNo)
        axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/classList/attendance?token='+this.props.token+'&classListID='+this.props.select.id+'&att_week='+this.props.attendanceNo
        // ,{
        //     classListID : this.props.select.id,
        //     att_week : this.props.attendanceNo
        // }, { credentials: true }
        )
        .then( response => {
            console.log('출석 리스트 222: ',this.props.attendanceNo,'주차',response.data)
            this.props.loginSuccess(response.data.token)
            this.setState({
                student : response.data.att_arr,
                attend: response.data.attend_count,
                tardy : response.data.late_count,
                absent : response.data.absent_count,
                error : response.data.error,
                classTime : response.data.class_day,
            },this.logout(this.state.error))
        })
        .catch( error => {
            console.log('출석 리스트 에러 ',error)          
            })      
    }

    date = (day) => {
        let weekday = new Array();
        weekday[0]="일요일"; weekday[1]="월요일"; weekday[2]="화요일"; weekday[3]="수요일"; weekday[4]="목요일"; weekday[5]="금요일"; weekday[6]="토요일";
        return weekday[day]
    }
    sortTime = (mode,Hours,Minutes) =>{
        let Min  = Minutes<10?"0"+Minutes : Minutes
        let Hour = Number(Hours)
        if (mode==12){
            Hours>12? Hour = Hours-12 : Hour = Hours-0
            return (Hours>12?"오후" : "오전") +" "+(Hour<10? "0"+Hour : Hour) + ":" + Min
        }
        if (mode==24){
            return (Hour<10? "0"+Hour : Hour) + ":" + Min
        }
    }

    componentDidMount() {
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
        let list = <div>로그인 정보가 만료되었습니다 <br/> 다시 주차를 선택해주세요</div>
        console.log(this.state.error==true) 
        if(this.state.error!=true){
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
            list = this.state.student.map(
                info => (<AttendWeekStudent key={info.attendance_id} update={this.listUpdata} order={info.name.search(this.state.search)} show={(show.indexOf(info.studentNo) == -1 ? false : true )} student={info} />)   
            );          
        }

        const date = new Date(this.state.classTime)
        return (
      
            <div id = "AttendWeekZone">
                <div id = "AttendWeekInfo">
                    <div id = "AttendWeekInfoTitle"> {this.props.attendanceNo}회차 수업 </div>
                    <div id = "AttendWeekInfoDate"> {date.getFullYear()}년 {date.getMonth()}월 {date.getDate()}일 {this.date(date.getDay())} {this.sortTime(24,date.getHours(),date.getMinutes())} </div>
                    <div id = "AttendWeekInfoState"> 
                        <span className="AttendStateAttendance">출석 : {this.state.attend}</span> 
                        <span className="AttendStateTrady">지각 :  {this.state.tardy}</span> 
                        <span className="AttendStateAbsent">결석 :  {this.state.absent}</span>
                    </div>
                    <div id="AttendWeekdelete"></div>
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
        logout : () => dispatch({type:'LOGOUT'}),
        }
    }
export default connect(mapStateToProps,mapDispatchToProps)(AttendWeekView);
