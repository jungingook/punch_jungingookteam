import { createStore } from "redux";

const selectCard = "selectCard";
const panelMode = "panelMode";
const classList = "classList";

const cardColor = {

}

const defaultState = {
    panelMode : "Error",
    selectCard: null,
    // classList: classList,
    cardColor : {
        default : ["#00B0F0","#009FF0"], // 블루와 같음
        red : ["#00B0F0","#009FF0"],
        blue : ["#00B0F0","#009FF0"], // 확정
        green : ["#81E400","#81E400"], // 바꾸기
        yellow : ["#FFC000","#FFB000"], //확정
        pink : ["#FF71D1","#FF4DD1"], //확정
        purple : ["#00B0F0","#009FF0"],
        black : ["#595959","#333333"] // 확정
    },
    classList: [
    {
        id: 0,
        name: '[테스트모드] 앱프로그래밍',
        professor: '정인국',
        code: '000000',
        day: 0,
        startTime: 600,
        endTime: 180,
        color :'#00B0F0',
        design : "default"
    },
    {
        id: 1,
        name: '[테스트모드] 웹프로그래밍',
        professor: '정인국',
        code: '000001',
        day: 0,
        startTime: 600,
        endTime: 180,
        color :'#00B0F0',
        design : "default"
    },
    {
        id: 2,
        name: '[테스트모드] C++',
        professor: '담당 교수',
        code: '000002',
        day: 0,
        startTime: 600,
        endTime: 180,
        color :'#00B0F0',
        design : "default"
    },
    {
        id: 3,
        name: '[테스트모드] 소프트웨어 캡스톤디자인',
        professor: '담당 교수',
        code: '000003',
        day: 0,
        startTime: 600,
        endTime: 180,
        color :'#00B0F0',
        design : "default"
    },
    {
        id: 4,
        name: '[테스트모드] 파이썬',
        professor: '담당 교수',
        code: '000004',
        day: 0,
        startTime: 600,
        endTime: 180,
        color :'#00B0F0',
        design : "default"
    },
    ],
    
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        // 카드 선택시
        case selectCard :
            return {
                ...state,
                selectCard: action.id
            } 
        case panelMode :
            return {
                ...state,
                panelMode: action.panelMode
            } 
        case classList :
            return {
                ...state,
                classList: action.classList
            } 
        default:
            //console.log("리듀스 성공");
            return state; 
        }
};

const store = createStore(reducer);
export default store;
