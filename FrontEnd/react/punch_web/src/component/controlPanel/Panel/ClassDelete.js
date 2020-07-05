// 모듈 연결
import React, { Component , Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../../store";
// [ajax] axios 연결
import axios from 'axios';
// 컴포넌트 연결
class ClassDelete extends Component {
    state = {
        step : 0,
        cssClass : 'classDeleteButtonOff'
    }

    deleteText = (e) => {
        if (e.target.value == "학생데이터와 출석기록이 모두 삭제됩니다") {
            this.setState({
                cssClass : 'classDeleteButtonOn',  
            })
        } else {
            this.setState({
                cssClass : 'classDeleteButtonOff',  
            })        
        }
    }   
    password = (e) => {
        console.log('비밀번호 : ',e.target.value ) 
    }   
    passwordCheck = (e) => {
        console.log('비밀번호 : ',e.target.value ) 
        this.setState({
            step : 1      
        })
    }   
    classDelete = () =>{
        console.log( '준비중 : ', this.props.select.name,  'id : ', this.props.select.id) 
            if (this.state.cssClass=='classDeleteButtonOn'){
                axios.delete('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/classList?token='+this.props.token, {
                 data : {  classListID: this.props.select.id, }     
                })
                .then( response => {
                    console.log(response.data)
                    this.props.loginSuccess(response.data.token)
                    this.props.classListRefresh(true)
                })
                .catch( error => {
                })
            }
            // this.props.classListRefresh(true)
    }

    render() { 
        let login = (
            <div id="ClassDeleteinfo">
            <div id="ClassDeleteinfoTitle"><span>본인인증</span></div>
            <div id="ClassDeleteinfoBody">
                <div> 수업 삭제를 위해서 본인인증을 진행합니다. <br/>비밀번호를 다시한번 입력해주세요</div>
                <input id="ClassDeleteLogin" type="password" placeholder="비밀번호" onChange={this.password}/>
                <div id="ClassDeleteLoginButton" onClick={this.passwordCheck}> 로그인 </div>
            </div>
        </div>
        )
        let deleteText = (
            <div id="ClassDeleteinfo">
                <div id="ClassDeleteinfoTitle"><span>수업삭제</span></div>
                <div id="ClassDeleteinfoBody">
                    <div>모든 출석 기록과 학생목록이 삭제됩니다 수업을 삭제하시려면 <br/> 아래 텍스트 필드에 "학생데이터와 출석기록이 모두 삭제됩니다" 라고 작성하세요 </div>
                    <input id="ClassDeleteinput" placeholder="학생데이터와 출석기록이 모두 삭제됩니다" onChange={this.deleteText}/> 
                </div>
            </div>
        )
        return (
            <div id ="ClassDelete">
                <div id="ClassDeleteWarning">
                    <span>주의</span><br/> 수업을 삭제하면 <b>학생데이터와 출석기록이</b> 모두 사라지며 <b>복구할 수 없습니다.</b>  <br/> '삭제' 대신 '숨기기'를 사용하여 수업을 안보이게 할 수 있습니다. 
                </div>
                {(this.state.step==0?login:'')}
                {(this.state.step==1?deleteText:'')}
                <div id="classDeleteButton" className={this.state.cssClass} onClick={()=>this.classDelete()}> 
                {(this.state.step==0?'본인인증을 진행해주세요':'')}
                {(this.state.step==1?'수업삭제':'')}
                </div> 
            </div>  
  
            );
        }
    }
    //export default Panel;
function mapDispatchToProps(dispatch){
    return {
        loginSuccess : (token) => dispatch({type:'LOGINSUCCESS',jwt : token}),
        classListRefresh : (value) => dispatch({ type: "classListRefresh",refresh : value}),
    }
}

const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard,
    token :  state.jwtToken
  })


export default connect(mapStateToProps,mapDispatchToProps)(ClassDelete);