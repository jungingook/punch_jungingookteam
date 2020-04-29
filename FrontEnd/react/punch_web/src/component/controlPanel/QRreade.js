// 모듈 연결
import React, { Component , Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../store";
// [ajax] axios 연결
import axios from 'axios';
// 컴포넌트 연결



class QRreade extends Component {

    handle = () => {
        store.dispatch({ type: "panelMode",panelMode : "QRactive"})
        axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/classList/qr/open', {
            classListId: this.props.select.id,
            classHour : 1200,
          })
        .then( response => {
            console.log("QR코드 생성")
        })
        .catch( error => {
            console.log(error)
          })
    }
    
    startTime = (startTime) => {
        return Math.floor(startTime/60) + ":" + (startTime%60<10? "0"  +startTime%60 : startTime%60 )
    }

    render() { 
        let d = new Date();
        let test = d.getHours()+":"+(d.getMinutes());
        let bgColor={backgroundColor: this.props.cardColor[this.props.select.color][0]}
        return (
            <div id = "QRreadePanel">
                <div id ="cheakLevel">
                <div className ="QRreadePanelSetsummar">출석체크 보안 난이도를 설정합니다.</div>
                    <div id ="cheakLevelSelect">
                        <div id ="bnt" className = "cheakLevelBnt">널널하게</div>    
                        <div id ="bnt" className = "cheakLevelBnt">적당하게</div>
                        <div id ="bnt" className = "cheakLevelBnt">엄격하게</div>  
                    </div>  
                    <div id ="cheakLevelInfo">
                        엄격하게 :<br/> 지문, 얼굴 인식과 GPS를 통해 엄격한 인증을 진행합니다.
                    </div>           
                </div>
                <div id ="cheakTime">
                    <div className ="QRreadePanelSetsummar">수업 시작 시간을 선택합니다.</div>
                    <div id ="cheakTimeSelect">
                        <div id ="bnt" className = "cheakTimeBnt">{this.startTime(this.props.select.startTime)}<small>(수업시간)</small></div>    
                        <div id ="bnt" className = "cheakTimeBnt">{test}<small>(현제시간)</small></div>
                        <div id ="bnt" className = "cheakTimeBnt">직접입력</div>  
                    </div> 
                    <div id ="cheakTimeInfo">
                        현제시간 :<br/> 지금시간({this.startTime(this.props.select.startTime)}) 에서 5분간 출석자에게 출석인정을 하며 20분 이후는 결석으로 처리합니다. 
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
    selectCard : state.selectCard,
    cardColor : state.cardColor
  })


export default connect(mapStateToProps)(QRreade);