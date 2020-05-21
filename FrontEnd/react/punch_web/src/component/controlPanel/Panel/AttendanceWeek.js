// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결

// [리듀스]스토어 연결
import store from "../../../store";

class AttendanceWeek extends Component {

    attendanceClick = () => {
       this.props.selectAttendanceWeek(this.props.data.no)
       this.props.PanelSelect('AttendanceWeek')
    }


    render() {

        const date = new Date();

        return (
            <div className = "AttendanceWeek" onClick={()=> this.attendanceClick()} >
                <div className = "AttendanceWeekNo"> {this.props.data.no} 차 수업 </div>
                <div className = "AttendanceDate"> {date.toDateString()} </div>
                <div className = "AttendanceState"> <span className="AttendanceStateAttendance">출 {this.props.data.attendance}</span> <span className="AttendanceStateTrady">지 {this.props.data.trady}</span> <span className="AttendanceStateAbsent">결 {this.props.data.absent}</span></div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({

})

function mapDispatchToProps(dispatch){
    return {
        selectAttendanceWeek : (no) => dispatch({ type: "selectAttendanceWeek",attendanceNo :no}),
        PanelSelect : (mode) => dispatch({ type: "panelMode",panelMode :mode}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AttendanceWeek);