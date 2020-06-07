// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";

// 컴포넌트 연결

class AttendanceUser extends Component {

    state = {
        display : true,
        expansion : false,
        stateChange : false,
        studentState : '출석'
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
        this.setState({
            studentState : state
        },console.log(state))
    }

    render() {
        let bgcolor = { 출석 : {backgroundColor : 'rgb(153, 197, 86)'},지각 : {backgroundColor : 'orange'},결석 : {backgroundColor : 'red'} }
        console.log(this.props.name,':',this.props.order,)
        return (
            <div className = "attendanceUser" style={(this.props.show?{margin : '0.5vh auto', filter: 'opacity(100%)', order : this.props.order}:{margin : '0px auto', filter: 'opacity(0%)'})}  > 
                <div className = "attendanceUserName" style={(this.props.show?{height : '5vh'}:{height : '0px'})}>
                {this.props.name}
                </div>
                <div className = "attendanceUserState" style={(this.props.show?{height : '5vh'}:{height : '0px'})}>
                    <div>출석</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    attendanceNo : state.attendanceNo,
    panelMode : state.panelMode,
  })

export default connect(mapStateToProps)(AttendanceUser);
