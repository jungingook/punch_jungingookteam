// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결

// [리듀스]스토어 연결
import store from "../../../store";

class AttendanceWeek extends Component {

    attendanceClick = () => {
       this.props.selectAttendanceWeek(this.props.data.week)
       this.props.PanelSelect('AttendanceWeek')
    }

    render() {

        const date = new Date(this.props.data.day);
        const mon = date.getMonth()+1
        const day = date.getDate()
        return (
            <div className = "AttendanceWeek" onClick={()=> this.attendanceClick()} title={"출석"+this.props.data.attendance_count+"명 지각"+this.props.data.late_count+"명 결석"+this.props.data.absent_count+"명"}>
                <div className = "AttendanceDate"> {mon}월{day}일</div>
                <div className = "AttendanceWeekNo"> {this.props.data.week}<span className = "AttendanceWeekText" > 회차</span></div>
                <div className = "AttendanceState"> <span className="AttendanceStateAttendance">{this.props.data.attendance_count}</span> <span className="AttendanceStateTrady">{this.props.data.late_count}</span> <span className="AttendanceStateAbsent">{this.props.data.absent_count}</span></div>
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