// 모듈 연결
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결

// [ajax] axios 연결
import axios from 'axios';

// [리듀스]스토어 연결
import store from "../../../store";


class WeekList extends Component {
    
    state = {
        show : true,
        deleteClick : false
    }

    weekCllck = () => {
        // 마지막 수업인 경우 클릭시 마지막 수업 이어하기 기능 
        if (this.props.last){
            this.props.weekSelect(this.props.data.week)
            this.props.PanelSelect('QRreade')
        }
    }
    weekDelete = () => {
        // 마지막 수업인 경우 클릭시 마지막 수업 이어하기 기능 
        if (this.props.last){
            this.setState({show : false})
            this.props.back()
            axios.delete('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/week?token='+this.props.token,{
                data : {
                            class_id : this.props.select.id,
                            week : this.props.data.week
                        }
            }, { credentials: true })
            .then( response => {
                console.log(this.props.select.id,'수업 [삭제됨]',this.props.data.week,'회차 수업',response)
            })
            .catch( error => {
                console.log('수업의 회차 삭제 에러 ',error)          
                })      
        }
    }
    componentDidUpdate(){
        console.log(this.props.last)
    }


    render() {
        let color = (this.props.last&&this.props.overlap? {backgroundColor:"#aaa"} : {backgroundColor:"#ccc"})
        const date = new Date(this.props.data.day);
        const now = new Date(this.props.data.day);
        const mon = date.getMonth()+1
        const day = date.getDate()
    
        return (
            <Fragment>
            <div className = {this.state.show? "weekObj":'weekObj weekObjDeleteAni'} title={'이전 회차 수업을 이어서 진행합니다'}style={color}>
                <div  className = "weekObjInfo"  onClick={()=> this.weekCllck()} >
                    <div className = "weekObjDate"> {mon}월{day}일</div>
                    <div className = "weekObjNo"> {this.props.data.week}<span> 회차</span></div>
                    <div className = "weekObjState"> <span className="stateAttendance">{this.props.data.attendance_count}</span> <span className="stateTrady">{this.props.data.late_count}</span> <span className="stateAbsent">{this.props.data.absent_count}</span></div>
                </div>  
                {(this.props.last&&this.props.delete?      
                <div className = "weekObjDelete" onClick={()=> this.weekDelete()} ></div>  
                :'')}
            </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    token :  state.jwtToken,
})

function mapDispatchToProps(dispatch){
    return {
        selectAttendanceWeek : (no) => dispatch({ type: "selectAttendanceWeek",attendanceNo :no}),
        PanelSelect : (mode) => dispatch({ type: "panelMode",panelMode :mode}),
        weekSelect : (week) => dispatch({ type: "WEEKSLECET",week}),
        
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(WeekList);