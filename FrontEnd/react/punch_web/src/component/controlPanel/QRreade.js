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

    render() { 
        
        return (
            <Fragment>
                <div id ="cheakLevel">
                    출석체크 보안 난이도를 설정합니다.
                    <div id ="bnt">
                        <div id ="bnt">11:00(수업시간)</div>    
                        <div id ="bnt">11:00(현제시간)</div>    
                        <div id ="bnt">직접입력</div>  
                    </div>             
                </div>
                <div id ="cheakTime">
                    수업 시작 시간을 선택합니다.
                    <div id ="bnt">
                        <div id ="bnt">11:00(수업시간)</div>    
                        <div id ="bnt">11:00(현제시간)</div>    
                        <div id ="bnt">직접입력</div>  
                    </div> 
                </div>
                <div id ="QRreadeBnts">
                    <div id ="QRcodeSetBnt">세부설정</div>
                    <div id ="QRcodeMakeBnt" onClick={this.handle} >QR생성</div>
                </div>

            </Fragment>
        );
    }
}
//export default Panel;
const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard
  })


export default connect(mapStateToProps)(QRreade);