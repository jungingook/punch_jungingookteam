// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../store";

// 컴포넌트 연결

class BackBnt extends Component {
    
    handle = () => {
        store.dispatch({ type: "panelMode",panelMode : "QRreade"})
          }
    
    render() {
        return (
            <div id="leftBnt" onClick={this.handle}> 
            <span>◀</span> 
            </div>
        );
    }
}

//export default Panel;
const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard,
    cardColor : state.cardColor
})

export default connect(mapStateToProps)(BackBnt);