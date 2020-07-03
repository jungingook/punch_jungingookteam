// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결
import AttendanceWeek from './AttendanceWeek'; // 패널 비활성화

// [리듀스]스토어 연결
import store from "../../../store";
// [ajax] axios 연결
import axios from 'axios';
// 컴포넌트 연결



class AttendanceCheck extends Component {

    state = {
        week : 'lode'
    }
    

    logout = (message) => {
        console.log(message,'로그아웃')
        axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/logout')
        this.props.logout()
    }

    Refresh = () => {
        if(!this.props.token){
            this.logout()
            return
        }
        // 에러 
        axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/classList/attendance?token='+this.props.token+'&classListID='+this.props.select.id, 
        // {
        //     // classListID : this.props.select.id
        // }
        )
        .then( response => {
            if (response.message == "잘못된 토큰이 왔습니다."){
                this.logout('어텐던스 토큰 에러 : ',this.props.token,'로 인한')
                return
            }
            console.log('리스트',response.data)
            let list = response.data.result_arr.filter((week) => week!=null)
            this.setState({
                week : list
            })
        })
        .catch( error => {
            console.log('새로운 요청 에러',error)
            this.setState({
                week : false
            })
        })
    }

    
    componentDidMount() {
        console.log("출석리스트 받아오기 : ",this.props.selectCard)
        this.Refresh()
    }

    componentDidUpdate(){
        console.log('변화감지',this.props.refresh)
        if(this.props.refresh){
            this.Refresh()
            this.props.RefreshFinish()
        }
    }


    render() {
        
        let list = <div> </div>
        let show = false
        if(!this.state.week){
            list = <div> <div>에러</div> </div>
        }
        else if(this.state.week=='lode'){
            list = <div> </div>
        }
        else if(this.state.week.length == 0){
            list = <div> <div></div><div>아직 진행된 수업이 없습니다.</div> </div>
        }
        else{
            show = true
            list = this.state.week.map(
                info => (<AttendanceWeek key={info.no} select={this.props.select} data={info}/>)   
            );      
        }

    

        return (
            <div id = "AttendanceCheckPanel">
                <div id = "AttendanceCheckPanelTitle" > 출석을 볼 수업 회차를 선택해주세요 </div>
                <div id="allWeek">
                    {/* {(show?<div id="AttendanceViewSelect"> 모든 수업보기 </div>:'')} */}
                    {list}
                </div>
            </div>
        );
    }
}
//export default Panel;

const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard,
    cardColor : state.cardColor,
    token :  state.jwtToken,
    refresh :  state.attendanceRefresh,
  })


function mapDispatchToProps(dispatch){
    return {
        logout : () => dispatch({type:'LOGOUT'}),
        RefreshFinish : () => dispatch({type:'attendanceRefresh',refresh : false}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AttendanceCheck);