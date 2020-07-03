// 모듈 연결
import React, { Component , Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../../store";
// 컴포넌트 연결
import AttendanceUser from '../AddOn/AttendanceUser'; // 학생출석표 생성 

class QRactive extends Component {
    state = {
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

    }
    studentSearch = (e) => {
        this.setState({
            search : e.target.value,
        })
    }
    
    render() { 
        let result  
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
        let list = this.state.student.map(
            info => (<AttendanceUser key={info.studentNo} name={info.name} order={info.name.search(this.state.search)} show={(show.indexOf(info.studentNo) == -1 ? false : true )}  studentNo={info.studentNo}  attendTime={info.attendTime} />)   
        );
        return (
            <div id = "QRActivePanel">
                {this.props.week}회차 수업
            </div>      
            );
        }
    }
    //export default Panel;
const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard
  })

export default connect(mapStateToProps)(QRactive);