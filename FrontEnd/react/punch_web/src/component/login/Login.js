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

    }
    componentWillMount() {

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
                            <input id="loginID" placeholder="아이디" />
                            <div></div>
                            <input id="loginPassWord" placeholder="비밀번호" type="password" />
                            <div></div>
                            <div id="loginBoxButton" onClick={() => this.props.loginSuccess()} > 로그인 </div>
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
    })

function mapDispatchToProps(dispatch){
    return {
        loginSuccess : () => dispatch({type:'LOGINSUCCESS'}),
        }
    }
export default connect(mapStateToProps,mapDispatchToProps)(Login);



