// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../store";

// 컴포넌트 연결

class BackBnt extends Component {
    
    click = () => {
        switch (this.props.panelMode){

            case 'QRactive' : 
                this.props.PanelSelect( "QRreade")
                break;

            case 'AttendanceWeek' : 
                this.props.PanelSelect( "Select")
                break;
        }


          }
    
    render() {
        return (
            <div id="leftBnt" onClick={()=>this.click()}> 
            <span>◀</span> 
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    panelMode : state.panelMode,
})

function mapDispatchToProps(dispatch){
    return {
        PanelSelect : (mode) => dispatch({ type: "panelMode",panelMode :mode}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BackBnt);