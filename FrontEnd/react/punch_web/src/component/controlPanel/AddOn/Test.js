// 모듈 연결
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";

// 컴포넌트 연결
import QRactiveList from './QRactiveList'; // QR코드 체크

class Test extends Component {
    
    state = {
        show : true
    }
    render() {
        return (
            <Fragment>
                {this.state.show?
            <div id = "Test">   
                <div>
                <button id = "Testbt" onClick = {()=> this.setState({show : false})}>테스트 패널 끄기</button>
                </div>
                값
                <div title={this.props.token}>토큰값 : {this.props.token?'존재':'미존재'}</div>
                <div style={{display:'flex',justifyContent: 'space-between'}}>
                    <div>선택된카드 : {this.props.selectCard}</div>
                    <div>선택된주차 : {this.props.qrCreactWeek}</div>
                    <div>화면의상황 : {this.props.panelMode}</div>
                </div>
                <div style={{display:'flex',justifyContent: 'space-between'}}>
                    <button onClick = {()=> this.props.tokenKill()}>토큰값 제거</button>
                </div>
            </div>
                :
                // <button id = "Testbt" onClick = {()=> this.setState({show : true})}>테스트 패널 켜기</button>
                ''
                }
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

function mapDispatchToProps(dispatch){
return {
    tokenKill : () => dispatch({type:'테스트토큰제거'}),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Test);