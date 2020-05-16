// 모듈 연결
import React, { Component } from 'react'; //리엑트 연결 
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../store";
// [ajax] axios 연결
import axios from 'axios';

// 컴포넌트 연결


class AddDate extends Component {
   
    state = {
        cssClass : "AddClassDate",
        startDay : '',
        endDay :''

    }

    // 상위 컴포넌트에게 시간값을 전달합니다.
    uplode = () => {
        if(this.state.startDay!=''&&this.state.endDay!=''){
            console.log('업로드 준비됨')
            // this.props.dataBack([this.state.day,this.state.startTime,this.state.endTime-this.state.startTime,this.props.id]);
            // this.effectCancel()
        }
        else{
            console.log('준비 안됨')
            // this.ready()
        }
    }
    startDayBlur = (e) => {
        console.log(e.target.value)
        this.setState({
            startDay : e.target.value,       
        })
    }
    endDayBlur = (e) => {
        console.log(e.target.value)
        this.setState({
            endDay : e.target.value,       
        })
    }
    render() {
        return (
            <div className = "AddClassDate"> 
            <div className = "AddClassDateInput"> <span>수업 시작일 : </span> <input id="AddClassStartDate"  className = "AddClassDateInputTag" onChange={this.startDayBlur} onBlur={this.uplode} type="date"/></div>
            <div className = "AddClassDateInput"> <span>수업 종료일 : </span> <input id="AddClassEndDate" className = "AddClassDateInputTag" onChange={this.endDayBlur} onBlur={this.uplode} type="date"/></div>              
            </div>
        );
      }      
}

const mapStateToProps = (state) => ({
    cardColor : state.cardColor
  })
export default connect(mapStateToProps)(AddDate);