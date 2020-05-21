// 모듈 연결
import React, { Component , Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../../store";
// 컴포넌트 연결
class QRactive extends Component {

    render() { 
        return (
            <div id ="QRactivePanel">
                <div>검사창</div>
                <div>
                    <div>미출석자만 보기</div>
                    <div>모든 인원 보기</div>
                </div>
                <div id ="attendancelist">
                    <div className="attendanceUser">정인국</div>
                    <div className="attendanceUser">정인국</div>
                    <div className="attendanceUser">정인국</div>
                    <div className="attendanceUser">정인국</div>
                    <div className="attendanceUser">정인국</div>
                    <div className="attendanceUser">정인국</div>
                    <div className="attendanceUser">정인국</div>
                    <div className="attendanceUser">정인국</div>
                    <div className="attendanceUser">정인국</div>
                </div>
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