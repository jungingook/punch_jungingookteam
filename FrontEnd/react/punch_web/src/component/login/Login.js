// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../store";
// [ajax] axios 연결
import axios from 'axios';
// 컴포넌트 연결

class Login extends Component {
    state = {
        id : 'p2id', // 임시 나중에 '' 으로 변경 
        password : 'p2pw', // 임시 나중에 '' 으로 변경 
    }
    
    idBlur = (e) => {
       console.log(e.target.value) 
       this.setState({
           id : e.target.value
       })
    }

    passwordBlur = (e) =>{
        console.log(e.target.value) 
        this.setState({
            password : e.target.value
        })
    }

    login = () => {
        console.log('로그인')
        // console.log('수업이름 : ',this.state.className,'수업요일 : ',this.state.backClassTimeList[0].day,'수업시간 : ',this.state.backClassTimeList[0].startTime,'~',this.state.backClassTimeList[0].endTime,'수업 컬러  : ',this.state.classColor,'수업디자인 : ',this.state.classDesign,)
        // 임시로 다중 시간을 입력하지 않고 입력된 첫 시간만 보냄 
        axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/login', {
            inputId: this.state.id,
            inputPw : this.state.password,
        }, { credentials: true })
        .then( response => {
            console.log("성공",response)
            this.props.loginSuccess(response.data.token)
            this.props.classListRefresh(true)
        })
        .catch( error => {
            console.log("실패",error)
            this.setState({
                password : ''
            })
        })
    }



    render() {
        return(
            <div id="LoginBoxPosition">
                <div id="LoginBox">
                    <div id="LoginBoxLeft">
                        <img id="LoginBoxLogo" src={ require('../../img/logoW.png') }/>
                    </div>
                    <div id="LoginBoxRight">
                        <div id="loginBoxInput">
                            <div id="loginBoxinfo">
                                출석체크 플렛폼 펀치에 오신것을 환영합니다.
                            </div>
                            <div id="loginBoxTitle">
                                Login
                            </div>
                            <input id="loginID" onBlur={this.idBlur} placeholder="아이디" />
                            <div></div>
                            <input id="loginPassWord"onBlur={this.passwordBlur}  placeholder="비밀번호" type="password" />
                            <div></div>
                            <div id="loginBoxButton" onClick={() => this.login()} > 로그인 </div>
                            <div id="loginBoxOption">
                                <div>회원가입 하기</div>
                                <div>아이디&amp;비밀번호 찾기</div>                           
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
        
    }
}
//export default Panel;
const mapStateToProps = (state) => ({
    panelMode : state.panelMode,
    token :  state.jwtToken
    })

function mapDispatchToProps(dispatch){
    return {
        loginSuccess : (token) => dispatch({type:'LOGINSUCCESS',jwt : token}),
        classListRefresh : (value) => dispatch({ type: "classListRefresh",refresh : value}),
        }
    }
export default connect(mapStateToProps,mapDispatchToProps)(Login);



