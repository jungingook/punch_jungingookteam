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
        cssClass : "AddClasstardy",
        tardy: 5,
        absent : 20, 
    }

    tardy = (e) => {
        this.setState({
        tardy: e.target.value
        })
        
    }

    absent = (e) => {
        this.setState({
            absent: e.target.value
        })
        
    }

    render() {
        let Attendance = {flex:this.state.tardy}
        let trady = {flex:this.state.absent-this.state.tardy}
        let absent = {flex:300 - (this.state.tardy +this.state.absent)}
        // console.log(this.props.times.reduce((timeA,tiemB) => timeA.endtime < tiemB.endtime))
        if (this.props.times.length == 0) {
        
        }else{
        console.log(this.props.times)
        console.log([{endtime: 500}].reduce((timeA,tiemB) => (timeA.endtime < tiemB.endtime?timeA.endtime:tiemB.endtime)))
        }
        return (

            <div id = "AddClassTardy"> 
                <div id = 'tardyView' >
                    <div style={Attendance}>
            
                    </div>
                    <div className = 'tardyViewText' style={trady}>
                        출석인정{this.state.tardy} 분 
                    </div>
                    <div style={absent}>
                    </div>
                </div>
                <div id = 'tardyView' >
                    <div id = 'AttendanceCell' style={Attendance}>
                        출석
                    </div>
                    <div id = 'tardyCell' style={trady}>
                        지각
                    </div>
                    <div id = 'absentCell' style={absent}>
                        결석
                    </div>
                </div>
                <div id = 'tardyView' >
                    <div style={Attendance}>

                    </div>
                    <div style={trady}>
                        
                    </div>
                    <div className = 'tardyViewText' style={absent}>
                        지각인정{this.state.absent} 분
                    </div>
                </div>
                <div id = 'tardyInput'>
                    <div className = "AddClassDateInput"> <span>지각 : </span> <input className = "AddClassDateInputTag" value={this.state.tardy} onChange={this.tardy} type="range" min="0" max="300" /></div>
                    <div className = "AddClassDateInput"> <span>결석 : </span> <input className = "AddClassDateInputTag" value={this.state.absent} onChange={this.absent} type="range" min="0" max="300" /></div>       
                </div>
                 
            </div>
        );
      }      
}

const mapStateToProps = (state) => ({
    cardColor : state.cardColor
  })
export default connect(mapStateToProps)(AddTardy);