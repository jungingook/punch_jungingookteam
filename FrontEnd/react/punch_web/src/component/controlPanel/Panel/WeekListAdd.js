// 모듈 연결
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결

// [리듀스]스토어 연결
import store from "../../../store";

class WeekListAdd extends Component {

    state = {
        add : true
    }

    weekCllck = () => {
            this.props.weekSelect(this.props.week)
            this.props.PanelSelect('QRreade')
    }
    render() {
        const date = new Date();
        const mon = date.getMonth()+1
        const day = date.getDate()

        console.log(this.props.color)
        return (
            <Fragment>
                { !this.state.add ? 
            <div className = "weekAdd" onClick = {()=> this.setState({ add : true})} >
                <div className = "weekAddInfo"> 새로운회차 <br/> 생성 </div>
            </div>
            :
            <div className = "weekObj" onClick = {()=>this.weekCllck()} style={{backgroundColor:'#aaa'}}>
                <div className = "weekObjDate"> {mon}월{day}일</div>
                <div className = "weekObjNo"> {this.props.week}<span> 회차</span></div>
                <div className = "weekObjStateloding"> 출석체크를 하지 않았습니다</div>
            </div>
            }
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    cardColor : state.cardColor
})

function mapDispatchToProps(dispatch){
    return {
        PanelSelect : (mode) => dispatch({ type: "panelMode",panelMode :mode}),
        weekSelect : (week) => dispatch({ type: "WEEKSLECET",week}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(WeekListAdd);