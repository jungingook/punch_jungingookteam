// 모듈 연결
import React, { Component } from 'react'; //리엑트 연결 
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../store";
// [ajax] axios 연결
import axios from 'axios';

// 컴포넌트 연결


class AddTardy extends Component {
   
    state = {
        cssClass : "AddClassTardyStart",
        tardy: 5,
        absent : 20, 
    }

    tardy = (e) => {
        this.setState({
        tardy: e.target.value
        },()=> this.uplode)
    }

    absent = (e) => {
        this.setState({
            absent: e.target.value
        },()=> this.uplode)
    }

    // 상위 컴포넌트에게 시간값을 전달합니다.
    uplode = () => {
        console.log('업로드됨 : ',this.state.tardy,this.state.absent)
        this.props.dataBack(this.state.tardy,this.state.absent);
    }
    tardyUplode = (tardy) => {
        console.log('특수 업로드됨 : ',tardy,(this.state.absent>this.props.times?this.props.times:this.state.absent))
        this.props.dataBack(tardy,(this.state.absent>this.props.times?this.props.times:this.state.absent));       
    }
    absentUplode = (absent) => {
        console.log('특수 업로드됨 : ',(this.state.tardy>this.props.times?this.props.times:this.state.tardy),absent)
        this.props.dataBack((this.state.tardy>this.props.times?this.props.times:this.state.tardy),absent);         
    }
    componentDidMount() {
        // 애니메이션을 위한 초기설정
        if(this.state.cssClass == "AddClassTardyStart" ) {
            this.setState({
                cssClass : "AddClassSelector"
            })
        }
    }

    render() {
        let Attendance = this.state.tardy
        let trady = (parseInt(this.state.tardy) >= parseInt(this.state.absent) ? 0 : parseInt(this.state.absent)-parseInt(this.state.tardy))
        let absent = this.props.times - (parseInt(Attendance) +parseInt(trady))
        console.log('중간값',parseInt(Attendance) +parseInt(trady))
        console.log('트루',parseInt(this.state.tardy) >= parseInt(this.state.absent)) 
        console.log('props',this.props.times, 'Tardy : ',this.state.tardy,'absent : ',this.state.absent,)
        console.log('출석 : ',Attendance ,'지각 : ',trady,'결석 : ',absent)
        if(this.props.times < this.state.tardy){
            this.setState({
                tardy: this.props.times
            },()=> this.uplode)
        }
        if(this.props.times < this.state.absent){
            this.setState({
                absent: this.props.times
            },()=> this.uplode)
        }    
        return (
            <div id="sscs"className = "AddClassSelector"> 
            <div className = "AddClassSelectorName">
                 수업 정책
            </div>
            <div id = "AddClassTardy"> 
                <div id = 'tardyView' >
                    <div style={{flex : Attendance}}>
            
                    </div>
                    <div className = 'tardyViewText' style={{flex :trady}}>
                        출석인정 : {(this.state.tardy==0?"정시 참여자만":this.state.tardy+"분")} 
                    </div>
                    <div style={{flex : absent}}>
                    </div>
                </div>
                <div id = 'tardyView' >
                    <div id = 'AttendanceCell'  style={{flex : Attendance}}>
                        출석
                    </div>
                    <div id = 'tardyCell' style={{flex : trady}}>
                        지각
                    </div>
                    <div id = 'absentCell' style={{flex : absent}}>
                        결석
                    </div>
                </div>
                <div id = 'tardyView' >
                    <div style={{flex : Attendance}}>

                    </div>
                    <div style={{flex : trady}}>
                        
                    </div>
                    <div className = 'tardyViewText' style={{flex :absent}}>
                        지각인정 : {(parseInt(this.state.tardy) >= parseInt(this.state.absent) ? "없음" : this.state.absent+"분")}
                    </div>
                </div>
                <div id = 'tardyInput'>
                    <div className = "AddClassDateInput"> <span>지각 : </span> <input className = "AddClassDateInputTag" value={this.state.tardy} onBlur={this.uplode} onChange={this.tardy} type="range" min="0" max={this.props.times} /></div>
                    <div className = "AddClassDateInput"> <span>결석 : </span> <input className = "AddClassDateInputTag" value={this.state.absent} onBlur={this.uplode} onChange={this.absent} type="range" min="0" max={this.props.times} /></div>       
                </div>
                </div>
            </div>
        );
      }      
}

const mapStateToProps = (state) => ({
    cardColor : state.cardColor
  })
export default connect(mapStateToProps)(AddTardy);