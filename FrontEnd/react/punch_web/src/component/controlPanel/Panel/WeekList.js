// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결

// [리듀스]스토어 연결
import store from "../../../store";

class WeekList extends Component {

    weekCllck = () => {
        // 마지막 수업인 경우 클릭시 마지막 수업 이어하기 기능 
        if (this.props.last){
            this.props.weekSelect(this.props.data.week)
            this.props.PanelSelect('QRreade')
        }

    }


    render() {
        console.log('각 주차',this.props.last,this.props.overlap)
        let color = (this.props.last&&this.props.overlap? {backgroundColor:"#aaa"} : {backgroundColor:"#ccc"})
        const date = new Date(this.props.data.day);
        const now = new Date(this.props.data.day);
        const mon = date.getMonth()+1
        const day = date.getDate()
    
        return (
            // <div className = "weekObjPosition">   
            <div className = "weekObj" title={'이전 회차 수업을 이어서 진행합니다'} onClick={()=> this.weekCllck()} style={color}>
                <div className = "weekObjDate"> {mon}월{day}일</div>
                <div className = "weekObjNo"> {this.props.data.week}<span> 회차</span></div>
                <div className = "weekObjState"> <span className="stateAttendance">{this.props.data.attendance_count}</span> <span className="stateTrady">{this.props.data.late_count}</span> <span className="stateAbsent">{this.props.data.absent_count}</span></div>
            </div>
            // </div>
        );
    }
}

const mapStateToProps = (state) => ({

})

function mapDispatchToProps(dispatch){
    return {
        selectAttendanceWeek : (no) => dispatch({ type: "selectAttendanceWeek",attendanceNo :no}),
        PanelSelect : (mode) => dispatch({ type: "panelMode",panelMode :mode}),
        weekSelect : (week) => dispatch({ type: "WEEKSLECET",week}),
        
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(WeekList);