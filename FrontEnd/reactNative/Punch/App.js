// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, SafeAreaView, StyleSheet, Button } from 'react-native';
// [ajax] axios 연결
import axios from 'axios';
// [redux] 최상단 컴포넌트 설정 
// import reducer from "./reducer"; // 직접 만든 reducer를 사용하기 위함. 
import { createStore } from 'redux'; // reducer를 store로 만들기 위해 사용 
import { Provider } from "react-redux"; // store를 component(Timer)에 연결하기 위해 사용 

// Redux 임포트

// 컴포넌트 연결
import ViewControl from './component/ViewControl'; // 앱의 메인 화면 구성을 담당하는 컴포넌트

const appStore = {
  AppMode : "MAIN",
}

const reducer = (state = appStore,action) =>{
  switch (action.type) {
    // 카드 선택시
    case "QRSCAN" :
        return {
            ...state,
            AppMode: "QRSCAN"
        } 
    case "MAIN" :
        return {
            ...state,
            AppMode: "MAIN"
        } 
    default:
        //console.log("리듀스 성공");
        return state; 
    }
}

const store = createStore(reducer); // createStore를 이용해 reducer를 store로 만들어서 const 변수에 넣음. 

const layout = StyleSheet.create({
  Main: {
    flex : 1,
  },
});
class App extends Component {
 
  render() {

    return (
      // 
      <Provider store={store}>
        <SafeAreaView style={layout.Main}> 
          <ViewControl/>
        </SafeAreaView>
      </Provider>
    );
  }
}
export default App;
