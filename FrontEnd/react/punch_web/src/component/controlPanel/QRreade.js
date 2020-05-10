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
    nowTime = () =>{
        let d = new Date();
        let Hour= d.getHours() < 10 ? "0"+d.getHours(): d.getHours();
        let Min= d.getMinutes() < 10 ? "0"+d.getMinutes(): d.getMinutes();
        return Hour+":"+Min
    }

    render() { 

        let bgColor={backgroundColor: this.props.cardColor[this.props.select.color][0]}
        return (
            <div id = "QRreadePanel">
                <div id ="cheakTime">
                    <div className ="QRreadePanelSetsummar">출석체크 시간을 선택합니다.</div>
                    <div className = "cheakTimeSelectZone">

                        <div id= "" className = "cheakTimeSelect">
                            <div className = "cheakTime"> {this.startTime(this.props.select.startTime)} </div>
                            <div className = "cheakText" style={bgColor}>
                            {/* <div> 수업시간 </div> */}
                            <div> 수업시간을 기준으로 해서 출석체크를 진행합니다.<br/> {this.startTime(this.props.select.startTime)}분 부터는 지각 {this.startTime(this.props.select.startTime)}분 부터는 결석이 됩니다.  </div>
                            </div>
                        </div>
                        <div id= "" className = "cheakTimeSelect">
                            <div className = "cheakTime"> {this.nowTime()} </div>
                            <div className = "cheakText" style={bgColor}>
                            {/* <div> 수업시간 </div> */}
                            <div> 지금시간을 기준으로 해서 출석체크를 진행합니다.<br/> {this.startTime(this.props.select.startTime)}분 부터는 지각 {this.startTime(this.props.select.startTime)}분 부터는 결석이 됩니다.  </div>
                            </div>
                        </div>
                        <div id= "" className = "cheakTimeSelect">
                            <div className = "cheakTime cheakTimeUser"> 
                            <input type = {Text} placeholder="13" maxLength="2"/>:<input type = {Text} placeholder="30" maxLength="2"/>
                            </div>
                            <div className = "cheakText" style={bgColor}>
                            {/* <div> 수업시간 </div> */}
                            <div> 사용자 설정 <br/> {this.startTime(this.props.select.startTime)}분 부터는 지각 {this.startTime(this.props.select.startTime)}분 부터는 결석이 됩니다.  </div>
                            </div>
                        </div>
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