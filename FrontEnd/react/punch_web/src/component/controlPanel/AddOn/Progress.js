// 모듈 연결
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";

// 컴포넌트 연결


class Progress extends Component {
    
    state = {
        show : true
    }
    render() {
        return (
            <Fragment>
                {this.state.show?
            <div id = "AddOnProgress">   

            </div>
                :''}
            </Fragment>
            
        );
    }
}

const mapStateToProps = (state) => ({
    panelMode : state.panelMode,
    classList : state.classList,
    selectCard : state.selectCard,
    cardColor : state.cardColor,
    token :  state.jwtToken,
    qrCreactWeek :  state.qrCreactWeek,
  })

export default connect(mapStateToProps)(Progress);