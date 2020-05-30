import { createStore } from "redux";

// const panelMode = "panelMode";
// const classList = "classList";

const defaultState = {
    AppMode : "main",
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        // 카드 선택시
        case 'AppMode' :
            return {
                ...state,
                AppMode: action.mode
            } 
            default:
                //console.log("리듀스 성공");
                return state; 
        }
};

const store = createStore(reducer);
// export default store;
