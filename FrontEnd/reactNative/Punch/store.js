import { createStore } from "redux";

const APPMODE = "AppMode";
// const panelMode = "panelMode";
// const classList = "classList";

const defaultState = {
    AppMode : "main",
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        // 카드 선택시
        case APPMODE :
            return {
                ...state,
                AppMode: action.id
            } 
            default:
                //console.log("리듀스 성공");
                return state; 
        }
};

const store = createStore(reducer);
// export default store;
