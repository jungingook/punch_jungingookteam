// 모듈 연결
import React, { Component } from 'react'; //리엑트 연결 
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../store";
// [ajax] axios 연결
import axios from 'axios';

// 컴포넌트 연결


class AddTime extends Component {
    // defaultProps[기본값 프로버티]
    static defaultProps = { 
        data: [],
    }
    state = {
        cssClass: "AddClassTime",
        day : "월요일",
        startTime : false,
        startHour : false,
        startMin : false,
        endTime : false,
        endHour : false,
        endMin : false,
    }
    funStartHour = (e) => {
        let val = parseInt(e.target.value) 
        this.setState({
            startHour : val,
            startTime : val*60 + parseInt(this.state.startMin),
        })
        this.uplode()
    }
    funStartMin = (e) => {
        let val = parseInt(e.target.value) 
        this.setState({
            startMin : val,
            startTime : parseInt(this.state.startHour)*60 + val,
        }) 
        this.uplode()
    }
    funEndHour = (e) => {
        let val = parseInt(e.target.value) 
        this.setState({
            endHour : val,
            endTime : val*60 + this.state.endMin,
        })
        this.uplode()
    }
    funEndMin = (e) => {
        let val = parseInt(e.target.value) 
        this.setState({
            endMin : val,
            endTime : parseInt(this.state.endHour)*60 +val,
        }) 
        this.uplode()
    }
    funselectDay =(e) => {
        this.setState({
            day : e.target.value,
        }) 
        this.uplode()
    }
    deleteClick = () => {
        this.props.ondelete(this.props.id);
        this.setState({
            cssClass: "AddClassTimeError AddClassTime ",
        }) 
        const SetTime = setTimeout( () => this.errorCancel(), 10 );
        return () => clearTimeout(SetTime);
    }

    errorCancel = () => {
        console.log('에러')  
        // this.setState({
        //     cssClass: "AddClassTime",
        // }) 
        // const SetTime = setTimeout( ()=> {
        //     }, 1000);
        //     return () => clearTimeout(SetTime);
    }

    // 상위 컴포넌트에게 시간값을 전달합니다.
    uplode = () => {
        console.log('스타트 타임',this.state.startTime,'엔드타임',this.state.endTime,)
        console.log('상태: ',this.state)
        if(this.state.startTime != false && this.state.endTime != false && this.state.startTime < this.state.endTime){
            console.log('업로드 준비됨')
            this.props.dataBack([this.state.day,this.state.startTime,this.state.endTime-this.state.startTime,this.props.id]);
        }
        else{
            console.log(' 준비 안됨')           
        }
    }

    render() {
        return (
            <div className = {this.state.cssClass}>
                <div className="AddClassTimeLeft">
                    <select className = "AddClassTimeSelectorDay" onChange={this.funselectDay}>
                        <option>월요일</option>
                        <option>화요일</option>
                        <option>수요일</option>
                        <option>목요일</option>
                        <option>금요일</option>
                        <option>토요일</option>
                        <option>일요일</option>
                    </select>
                    <input className="MakeClassHour " placeholder="13" maxLength="2" onChange={this.funStartHour}/>:<input className="MakeClassMin" placeholder="00" maxLength="2" onChange={this.funStartMin}/>
                    <div>부터</div>
                    <input className="MakeClassHour " placeholder="15" maxLength="2" onChange={this.funEndHour}/>:<input className="MakeClassMin" placeholder="50" maxLength="2" onChange={this.funEndMin}/>
                    <div>까지</div>
                </div>
                <div className="AddClassTimeRight">
                    <div className="AddClassTimeDelete" onClick={()=> this.deleteClick()} >x</div>
                </div>
        </div>
        );
      }      
}

const mapStateToProps = (state) => ({
    cardColor : state.cardColor
  })
export default connect(mapStateToProps)(AddTime);