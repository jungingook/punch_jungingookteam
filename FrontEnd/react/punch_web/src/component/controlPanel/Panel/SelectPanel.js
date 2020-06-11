// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결

// [리듀스]스토어 연결
import store from "../../../store";

class SelectPanel extends Component {

    render() {
        let bgColor={backgroundColor: this.props.cardColor[this.props.color][0]}
        return (
            <div id = "SelectPanel">
                <div id = "PanelCheckBnt" className ="SelectPanelBnt" onClick={() => this.props.PanelSelect("Week")} style ={bgColor} >
                    <div className ="PanelSelectFront">
                        <div className ="PanelSelectName">출석체크 </div>
                        <div className ="PanelSelectSummary">출석 체크를 위한 QR코드를 생성합니다.</div> 
                    </div>
                    <div className ="PanelSelectBack">

                    </div>
                </div>
                <div id = "PanelAttendanceBnt" className ="SelectPanelBnt" onClick={() => this.props.PanelSelect("AttendanceCheck")}>
                <div className ="PanelSelectFront">
                        <div className ="PanelSelectName">출결현황 </div>
                        <div className ="PanelSelectSummary">학생들의 출결 현황을 확인합니다.</div> 
                    </div>
                    <div className ="PanelSelectBack">

                    </div>
                </div>
                <div id = "PanelMessageBnt" className ="SelectPanelBnt" onClick={() => this.props.PanelSelect()}>
                <div className ="PanelSelectFront">
                        <div className ="PanelSelectName">메시지 </div>
                        <div className ="PanelSelectSummary">학생들과 메시지를 주고 받을 수 있습니다.</div> 
                    </div>
                    <div className ="PanelSelectBack">

                    </div>
                </div>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch){
    return {
        PanelSelect : (mode) => dispatch({ type: "panelMode",panelMode :mode}),
    }
  }
const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard,
    cardColor : state.cardColor
  })

export default connect(mapStateToProps,mapDispatchToProps)(SelectPanel);