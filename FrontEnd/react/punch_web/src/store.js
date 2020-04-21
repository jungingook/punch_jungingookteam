import { createStore } from "redux";

const selectCard = "selectCard";
const panelMode = "panelMode";

const defaultState = {
    panelMode : "Error",
    selectCard: null,
    classList: [
    {
        id: 0,
        name: '수업 이름',
        professor: '담당 교수',
        code: '000000',
        day: 0,
        startTime: 600,
        endTime: 180,
        color :'#00B0F0',
        design : "default"
    },
    {
        id: 1,
        name: '소프트웨어 캡스톤디자인',
        professor: '이승진',
        code: '000001',
        day: 5,
        startTime: 540,
        endTime: 180,
        color :'#00B0F0',
        design : "default"
    },
    {
        id: 2,
        name: '하이브리드 앱',
        professor: '김명철',
        code: '000002',
        day: 4,
        startTime: 720,
        endTime: 180,
        color :'#FFC000',
        design : "default"
    },
    {
        id: 3,
        name: '사회봉사',
        professor: '누군지 모름',
        code: '000003',
        day: 3,
        startTime: 900,
        endTime: 180,
        color :'#00B0F0',
        design : "default"
    },
    {
        id: 4,
        name: '사회봉사',
        professor: '누군지 모름',
        code: '000003',
        day: 3,
        startTime: 900,
        endTime: 180,
        color :'#00B0F0',
        design : "default"
    }
    ]

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
        default:
            //console.log("리듀스 성공");
            return state; 
        }
};

const store = createStore(reducer);
export default store;
