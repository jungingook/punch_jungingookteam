// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결

// [리듀스]스토어 연결
import store from "../../../store";


// 출석체크의 중복이 의심되는 경우 표시해주는 페이지
class WeekPanel extends Component {

    selectButton = (mode) =>{

    if (mode == 'thisWeek'){
        this.props.weekSelect(this.props.week-1)
    }
    if (mode == 'nextWeek'){
        this.props.weekSelect(this.props.week)  
    }
    this.props.PanelSelect("QRreade")
    }

    render() {
        let bgColor={backgroundColor: this.props.cardColor[this.props.select.color][0]}
        let fontColor={color: this.props.cardColor[this.props.select.color][1]}
        return (

            <div id = "WeekPanel">
                <div id = 'WeekPanelInfo'>
                <span style={fontColor}>{this.props.lastTime}분전</span> 출석체크를 진행한 기록이 있습니다. <br/>
                이어서 출석체크를 하시겠습니까 ? 
                </div>
                <div id='SelectWeekZone'>
                    <div className='selectWeek' style={bgColor} onClick={() => this.selectButton('thisWeek')}>
                        <div>이미지</div>
                        <div>이어서 출석 체크를 진행합니다.</div>
                    </div>
                    <div className='selectWeek' onClick={() => this.selectButton('nextWeek')}>
                        <div>이미지</div>
                        <div>새로운 주차로 출석 체크를 진행합니다.</div>
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

export default connect(mapStateToProps,mapDispatchToProps)(WeekPanel);