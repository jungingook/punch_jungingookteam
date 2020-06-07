// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../store";

// 컴포넌트 연결
import Standby from './Panel/Standby'; // 패널 비활성화
import ActivePanel from './Panel/ActivePanel'; // 패널 활성화
import InfoZone from "./Zone/InfoZone"; // 존 
import AddOn from './AddOn/AddOn';


class Panel extends Component {
    
    // handle = () => {
    //     let id = this.props.info.id
    //     store.dispatch({ type: "selectCard",id : id})
    //     store.dispatch({ type: "panelMode",panelMode : "Select"})
    // }

    

    addon = (size) => {

    }



    render() {
        let bgColor={backgroundColor:"#FFFEFF"}
        let Panel = <div id = "PanelStandby" style={{height:'70vh'}}><Standby/></div>;
        let info = <InfoZone/>;
        let addon = <AddOn/>;
        if(this.props.selectCard != null){
            
            console.log(this.props.selectCard+"카드 선택")
            let x = 0;
            for (let index = 0; index <  this.props.classList.length; index++) {
                if (this.props.classList[index].id == this.props.selectCard){
                    bgColor={background:this.props.cardColor[this.props.classList[index].color][0]}
                    Panel = <ActivePanel panelSize={this.panelSizeControl} select={this.props.classList[index]}/>;
                    info = <InfoZone select={this.props.classList[index]}/>
                }
            }
            
        } 

        return (
            <div id = "Panel" style={bgColor}>
                <div id = "PanelInside">
                    {Panel}
                    {addon}
                </div>
                <div id = "PanelOutside">
                    {info}
                </div>
            </div>
            
        );
    }
}
//export default Panel;
// function mapDispatchToProps(dispatch){
//     return {
//         selectCard2 : (id) => dispatch({ type: "selectCard",id : id}),
//         panelMode2 : (mode) => dispatch({ type: "panelMode",panelMode : mode})
//     }
// }

const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard,
    cardColor : state.cardColor
  })

export default connect(mapStateToProps)(Panel);