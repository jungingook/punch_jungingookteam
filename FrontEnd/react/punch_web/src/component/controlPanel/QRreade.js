// 모듈 연결
import React, { Component , Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../store";
// 컴포넌트 연결



class QRreade extends Component {

    handle = () => {
        store.dispatch({ type: "panelMode",panelMode : "QRactive"})
    }
    
    startTime = (startTime) => {
        return Math.floor(startTime/60) + ":" + (startTime%60<10? "0"  +startTime%60 : startTime%60 )
    }

    render() { 
        let d = new Date();
        let test = d.getHours()+":"+(d.getMinutes());
        let bgColor={backgroundColor: this.props.select.color}
        return (
            <div id = "QRreadePanel">
                <div id ="cheakLevel">
                    출석체크 보안 난이도를 설정합니다.
                    <div id ="cheakLevelSelect">
                        <div id ="bnt">널널하게</div>    
                        <div id ="bnt">적당하게</div>
                        <div id ="bnt">엄격하게</div>  
                    </div>             
                </div>
                <div id ="cheakTime">
                    수업 시작 시간을 선택합니다.
                    <div id ="cheakTimeSelect">
                        <div id ="bnt">{this.startTime(this.props.select.startTime)}<small>(수업시간)</small></div>    
                        <div id ="bnt">{test}<small>(현제시간)</small></div>
                        <div id ="bnt">직접입력</div>  
                    </div> 
                </div>
                <div id ="QRreadeBnts">
                    <div id ="QRcodeSetBnt">세부설정</div>
                    <div id ="QRcodeMakeBnt" style={bgColor} onClick={this.handle} >QR생성</div>
                </div>
            </div>
        );
    }
}
//export default Panel;
const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard
  })


export default connect(mapStateToProps)(QRreade);