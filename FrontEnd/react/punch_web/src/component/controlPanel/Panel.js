// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../store";

// 컴포넌트 연결
import Standby from './Standby'; // 패널 비활성화
import ActivePanel from './ActivePanel'; // 패널 활성화
import QRcode from "./QRcode";


class Panel extends Component {
    
    handle = () => {
        let id = this.props.info.id
        store.dispatch({ type: "selectCard",id : id})
        store.dispatch({ type: "panelMode",panelMode : "Select"})
    }

    render() {
        let bgColor={backgroundColor:"#FFFEFF"}
        let mode = <Standby/>;
        let qrcode = null;
        if(this.props.selectCard != null){
            
            console.log(this.props.selectCard+"카드 선택")
            let x = 0;
            for (let index = 0; index <  this.props.classList.length; index++) {
                if (this.props.classList[index].id == this.props.selectCard){
                    bgColor={background:this.props.cardColor[this.props.classList[index].color][0]}
                    mode = <ActivePanel select={this.props.classList[index]}/>;
                    qrcode = <QRcode select={this.props.classList[index]}/>
                }
            }
            
        } 

        return (
            <div id = "Panel" style={bgColor}>
                <div id = "PanelBox">
                    {mode}
                </div>
                <div id = "QRzone">
                    {qrcode == null? "":qrcode}
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

export default connect(mapStateToProps)(Panel);