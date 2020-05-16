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
        cssClass: "AddClassTimeReady AddClassTime",
        day : "월요일",
        startTime : false,
        startHour : '',
        startMin : '',
        endTime : false,
        endHour : '',
        endMin : '',
    }

    // funStartHour = (e) => {
    //     let val = parseInt(e.target.value) 
    //     this.setState({
    //         startHour : val,
    //         startTime : val*60 + parseInt(this.state.startMin),
    //     })
    //     this.uplode()
    // }

    funStartHour = (e) => {
        let val = (e.target.value == '0'? 0 : parseInt(e.target.value) )
        if (val != 0 &&!parseInt(val)){
            this.setState({
                startHour : '',
            })
        } 
        else if (val > 23){
            this.setState({
                startHour : '',
            })
        }
        else {
            this.setState({
                startHour : val,
                startTime : val*60 + parseInt(e.target.value),
            })
        }
      }

    blurStartHour = (e) =>{   
        if (e.target.value == ""){
            this.setState({
                startHour : "00",
            }) 
        }
        else if (e.target.value < 10){
            this.setState({
                startHour : "0"+e.target.value,
            })           
        }
        this.uplode()
    }

    focusStartHour = (e) =>{
        this.setState({
            startHour : "",
        })                
    }


    funStartMin = (e) => {
        console.log(e.target.value)
        let val = (e.target.value == '0'? 0 : parseInt(e.target.value) )
        if (val != 0 &&!parseInt(val)){
            this.setState({
                startMin : '',
            })
            console.log('왜지')
        } 
        else if (val > 59){
            this.setState({
                startMin : '',
            })
            console.log('먼대')
        }
        else {
            this.setState({
                startMin : val,
                startTime : parseInt(this.state.startHour)*60 + val,
            })
        }
    }

    blurStartMin = (e) =>{   
        if (e.target.value == ""){
            this.setState({
                startMin : "00",
            }) 
        }
        else if (e.target.value < 10){
            this.setState({
                startMin : "0"+e.target.value,
            })           
        }
        this.uplode()
    }
    
    focusStartMin = (e) =>{
        this.setState({
            startMin : "",
        })                
    }

    funEndHour = (e) => {
        let val = (e.target.value == '0'? 0 : parseInt(e.target.value) )
        if (val != 0 &&!parseInt(val)){
            this.setState({
                endHour : '',
            })
        } 
        else if (val > 23){
            this.setState({
                endHour : '',
            })
        }
        else {
            this.setState({
                endHour : val,
                endTime : val*60 + parseInt(this.state.endMin),
            })
        }
    }
 
    blurEndHour = (e) =>{   
        if (e.target.value == ""){
            this.setState({
                endHour : "00",
            }) 
        }
        else if (e.target.value < 10){
            this.setState({
                endHour : "0"+e.target.value,
            })           
        }
        this.uplode()
    }
    
    focusEndHour = (e) =>{
        this.setState({
            endHour : "",
        })                
    }

    funEndMin = (e) => {
        let val = (e.target.value == '0'? 0 : parseInt(e.target.value) )
        if (val != 0 &&!parseInt(val)){
            this.setState({
                endMin : '',
            })
        } 
        else if (val > 59){
            this.setState({
                endMin : '',
            })
        }
        else {
            this.setState({
                endMin : val,
                endTime : parseInt(this.state.endHour)*60 +val,
            }) 
        }
    }

    blurEndMin = (e) =>{   
        if (e.target.value == ""){
            this.setState({
                endMin : "00",
            }) 
        }
        else if (e.target.value < 10){
            this.setState({
                endMin : "0"+e.target.value,
            })           
        }
        this.uplode()
    }
    
    focusEndMin = (e) =>{
        this.setState({
            endMin : "",
        })                
    }

    funselectDay =(e) => {
        this.setState({
            day : e.target.value,
        }) 
        this.uplode()
    }

    blurselectDay = (e) =>{   
        this.uplode()
    }

    deleteClick = () => {
        this.props.ondelete(this.props.id);
        this.error()
    }

    // 애니메이션을 위한 함수 

    error = () => {
        this.setState({
            cssClass: "AddClassTimeError AddClassTime ",
        })
        // this.errorCancel()
        // const SetTime = setTimeout( () => this.errorCancel(), 10 );
        // return () => clearTimeout(SetTime);
    }

    ready = () => {
        this.setState({
            cssClass: "AddClassTimeReady AddClassTime ",
        })
        // this.errorCancel()
        // const SetTime = setTimeout( () => this.errorCancel(), 10 );
        // return () => clearTimeout(SetTime);
    }

    effectCancel = () => {
        this.setState({
            cssClass: "AddClassTime",
        })     
    }

    

    // 상위 컴포넌트에게 시간값을 전달합니다.
    uplode = () => {
        console.log('스타트 타임',this.state.startTime,'엔드타임',this.state.endTime,)
        console.log('상태: ',this.state)
        if(this.state.startTime != false && this.state.endTime != false && this.state.startTime < this.state.endTime){
            console.log('업로드 준비됨')
            this.props.dataBack([this.state.day,this.state.startTime,this.state.endTime-this.state.startTime,this.props.id]);
            this.effectCancel()
        }
        else{
            console.log('준비 안됨')
            this.ready()
        }
    }

    render() {
        return (
            <div className = {this.state.cssClass}>
                <div className=" AddClassTimeLeft">
                    <select className = "AddClassTimeSelectorDay" onBlur={this.uplode} onChange={this.funselectDay}>
                        <option>월요일</option>
                        <option>화요일</option>
                        <option>수요일</option>
                        <option>목요일</option>
                        <option>금요일</option>
                        <option>토요일</option>
                        <option>일요일</option>
                    </select>
                    <input className="MakeClassHour " placeholder="13" maxLength="2" value={this.state.startHour} onBlur={this.blurStartHour} onFocus={this.focusStartHour} onChange={this.funStartHour}/>:<input className="MakeClassMin" placeholder="00" maxLength="2" value={this.state.startMin} onBlur={this.blurStartMin} onFocus={this.focusStartMin} onChange={this.funStartMin}/>
                    <div>부터</div>
                    <input className="MakeClassHour " placeholder="15" maxLength="2" value={this.state.endHour} onBlur={this.blurEndHour} onFocus={this.focusEndHour} onChange={this.funEndHour}/>:<input className="MakeClassMin" placeholder="50" maxLength="2" value={this.state.endMin} onBlur={this.blurEndMin} onFocus={this.focusEndMin} onChange={this.funEndMin}/>
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