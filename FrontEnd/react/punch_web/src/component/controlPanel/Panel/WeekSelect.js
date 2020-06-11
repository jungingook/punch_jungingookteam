// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";

// [ajax] axios 연결
import axios from 'axios';

// 컴포넌트 연결
import WeekList from './WeekList'; // QR코드 체크




class WeekSelect extends Component {

    state = {
        week : 'lode'
    }
    

    logout = () => {
        console.log('로그아웃')
        axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/logout')
        this.props.logout()
    }

    componentDidMount() {
        console.log("출석리스트 받아오기 : ",this.props.selectCard)

        if(!this.props.token){
            this.logout()
            return
        }

        axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/classList/attendance?token='+this.props.token, {
            classListID : this.props.select.id
        })
        .then( response => {
            if (response.message == "잘못된 토큰이 왔습니다."){
                this.logout()
                return
            }
            console.log('리스트',response.data)
            let list = response.data.result_arr.filter((week) => week!=null)
            this.setState({
                week : list
            })
        })
        .catch( error => {
            console.log('에러',error)
            this.setState({
                week : false
            })
        })
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
                info => (<WeekList key={info.no} select={this.props.select} data={info}/>)   
            );      
        }

    

        return (
            <div id = "AttendanceCheckPanel">
                <div id = "AttendanceCheckPanelTitle" > 출석을 볼 수업 회차를 선택해주세요 </div>
                <div id="allWeek"> 
                    {(show?<div id="AttendanceViewSelect"> 모든 수업보기 </div>:'')}
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
  })


function mapDispatchToProps(dispatch){
    return {
        logout : () => dispatch({type:'LOGOUT'}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(WeekSelect);