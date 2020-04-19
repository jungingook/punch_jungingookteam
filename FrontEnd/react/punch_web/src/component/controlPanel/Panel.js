// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../store";

// 컴포넌트 연결
import Standby from './Standby'; // 패널 비활성화
import ActivePanel from './ActivePanel'; // 패널 활성화
import QR from "./QR";


class Panel extends Component {
    
    render() {
        let bgColor={backgroundColor:"#FFFEFF"}
        let mode = <Standby/>;
        if(this.props.selectCard != null){
            
            console.log(this.props.selectCard+"카드 선택")
            console.log(this.props.classList[1].id)
            let x = 0;
            for (let index = 0; index <  this.props.classList.length; index++) {
                if (this.props.classList[index].id == this.props.selectCard){
                    bgColor={background:this.props.classList[index].color}
                    mode = <ActivePanel select={this.props.classList[index]}/>;
                }
            }
            
        } 

        return (
            <div id = "Panel" style={bgColor}>
                <div id = "PanelBox">
                    {mode}
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

export default connect(mapStateToProps)(Panel);