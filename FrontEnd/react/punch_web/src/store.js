import { createStore } from "redux";

const selectCard = "selectCard";
const panelMode = "panelMode";
const classList = "classList";

const defaultState = {
    panelMode : "Error",
    selectCard: null,
    loginActivation: true,
    addClass : false,
    classListRefresh: false, // 수업목록 새로고침
    attendanceRefresh: false, // 출결목록 새로고침
    attendanceNo  : 1,
    qrCreactWeek : null,
    jwtToken : null,
    thisweek : false,
    classRecord : null,
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
    classList: [
    {
        id: 0,
        name: '[테스트모드] 앱프로그래밍',
        professor: '정인국',
        code: '000000',
        day: 0,
        startTime: 600,
        endTime: 180,
        color :'green',
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
            if  (state.jwtToken!=null||action.force==true ){
                console.log(action.panelMode)
                return {
                    ...state,
                    panelMode: action.panelMode
                } 
            } else{
                return {
                    ...state
                }              
            }
        case classList :
            return {
                ...state,
                classList: action.classList
            } 
        case "LOGINSUCCESS" :
            return {
                ...state,
                loginActivation: false,
                jwtToken : action.jwt,
                classListRefresh: action.refresh,
            }
        case "LOGOUT" :
            return {
                ...state,
                loginActivation: true,
                jwtToken : null
            }  
        case "ADDCLASS" :
            return {
                ...state,
                addClass: true,
            }         
        case "ADDCLASSBACK" :
            return {
                ...state,
                addClass: false,
            }         
        case "classListRefresh" :
            return {
                ...state,
                classListRefresh: action.refresh,
            }     
        case "attendanceRefresh" :
            return {
                ...state,
                attendanceRefresh: action.refresh,
            }     
        case "selectAttendanceWeek" :
            return {
                ...state,
                attendanceNo: action.attendanceNo,
            }     
        case "WEEKSLECET" :
            return {
                ...state,
                qrCreactWeek: action.week,
            }   
        case "progressClassRecord" :
            return {
                ...state,
                classRecord: action.record,
            }   
            
        // 테스트용 
        case "테스트토큰제거" :
            return {
                ...state,
                jwtToken : null,
            }    
        default:
            //console.log("리듀스 성공");
            return state; 
        }
};

const store = createStore(reducer);
export default store;
