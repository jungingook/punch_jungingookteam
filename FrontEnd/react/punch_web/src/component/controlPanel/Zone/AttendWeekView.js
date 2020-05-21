// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";

// 컴포넌트 연결
import QRcode from './QRcode'; // 큐알코드 생성 
import AttendWeekStudent from './AttendWeekStudent'; // 큐알코드 생성 

class AttendWeekView extends Component {

    state = {
        search : '',
        student :[
        {name :'정인국', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'여은성', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'김민혁', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'정인국', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'여은성', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'김민혁', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'정인국', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'여은성', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'김민혁', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'정인국', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'여은성', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'김민혁', studentNo:201334023, attendTime:'13시 23분 07초'},
        {name :'이종호', studentNo:201334023, attendTime:'13시 23분 07초'},
        ],

    }
    studentSearch = (e) => {
        this.setState({
            search : e.target.value,
        })
    }

    render() {
        console.log(this.props.attendanceNo)
        console.log(this.props.panelMode)

        const result = this.state.student.filter(s =>(s.name.search(this.state.search) != -1));
        console.log(result)
        let id = 0
        let list = result.map(
            info => (<AttendWeekStudent key={id++} name={info.name} studentNo={info.studentNo}  attendTime={info.attendTime} />)   
        );          

        return (
            <div id = "AttendWeekZone">
                <div id = "AttendWeekInfo">
                    <div id = "AttendWeekInfoTitle"> {this.props.attendanceNo}회차 수업 </div>
                    <div id = "AttendWeekInfoDate"> 2020년 11월 10일 월요일 13:23 </div>
                    <div id = "AttendWeekInfoState"> 
                        <span className="AttendStateAttendance">출석 : 33</span> 
                        <span className="AttendStateTrady">지각 :  12</span> 
                        <span className="AttendStateAbsent">결석 :  03</span>
                    </div>
                </div>
                <div id = "AttendWeekInfoButton">
                이름으로 검색 : <input className= "AttendInfoinput" placeholder="학생검색" onChange={this.studentSearch}/>
                    <div className="AttendInfoButton" > 출석자만 보기 </div>
                    <div className="AttendInfoButton" > 지각자만 보기 </div>
                    <div className="AttendInfoButton" > 결석자만 보기 </div>                   
                </div>
                <div>
                    {list}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    attendanceNo : state.attendanceNo,
    panelMode : state.panelMode,
  })

export default connect(mapStateToProps)(AttendWeekView);
