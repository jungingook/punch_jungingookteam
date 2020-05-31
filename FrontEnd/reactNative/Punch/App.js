// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Platform } from 'react-native';
// [ajax] axios 연결
import axios from 'axios';
// [redux] 최상단 컴포넌트 설정 
// import reducer from "./reducer"; // 직접 만든 reducer를 사용하기 위함. 
import { createStore } from 'redux'; // reducer를 store로 만들기 위해 사용 
import { Provider } from "react-redux"; // store를 component(Timer)에 연결하기 위해 사용 
//import DeviceInfo from 'react-native-device-info'; //r고유 id 가저오기
// Redux 임포트

// 컴포넌트 연결
import ViewControl from './component/ViewControl'; // 앱의 메인 화면 구성을 담당하는 컴포넌트


//////////////////////////////////////////////////
// <스토어>
//////////////////////////////////////////////////
const appStore = {
  AppMode : "LOGIN",
  jwtToken : null,
  classListRefresh : true,
  selectCard: null,
  cardColor : {
    default : ["#00B0F0","#009FF0"], // 블루와 같음
    red : ["#E93A2E","#C92A1D"], // 확정
    blue : ["#00B0F0","#009FF0"], // 확정
    green : ["#99C556","#7EBB57"], // 확정
    yellow : ["#FFC000","#FFB000"], //확정
    pink : ["#E780BC","#E770AC"], // 확정 
    purple : ["#9949CE","#5C3088"], // 확정
    black : ["#595959","#474747"] // 확정
  },
}

const reducer = (state = appStore,action) =>{
  switch (action.type) {
    // 카드 선택시
    case "AppMode" :
        return {
            ...state,
            AppMode: action.mode,
            classListRefresh : true,
        } 
    case "LOGINSUCCESS" :
        return {
            ...state,
            jwtToken : action.token
        }
    case "TokenRefresh" :
      console.log('토큰 : ',action.token)
        return {
            ...state,
            jwtToken : action.token
        }
    case "LOGOUT" :
        return {
            ...state,
            jwtToken : null,
            AppMode: 'LOGIN'
        }
    case "ClassListRefresh" :
        return {
            ...state,
            classListRefresh : action.bool,
        }
    case "SelectCard" :
      return {
          ...state,
          selectCard : action.card,
          AppMode: 'CLASSVIEW'
      }
    default:
        //console.log("리듀스 성공");
        return state; 
    }
}
//////////////////////////////////////////////////
// </스토어>
//////////////////////////////////////////////////

const store = createStore(reducer); // createStore를 이용해 reducer를 store로 만들어서 const 변수에 넣음. 


class App extends Component {
 
  render() {

    return (
      // 
      <Provider store={store}>
          <ViewControl/>
      </Provider>
    );
  }
}
export default App;
