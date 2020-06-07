// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";

// 컴포넌트 연결
import QRactiveList from '../AddOn/QRactiveList'; // QR코드 체크

class Addon extends Component {
    addon = (mode) => {
        console.log(mode)
        let output = <div></div>
        // let panelsize = '25vh'
        if (mode == "QRactive") {
            // panelsize = '25vh'
            output = <QRactiveList select={1}/> 
        }
        return {component : output}
    }

    render() {
        let addon =  this.addon(this.props.panelMode)
        return (
            <div id = "addon">
                {addon.component}
            </div>
            
        );
    }
}

const mapStateToProps = (state) => ({
    panelMode : state.panelMode,
  })

export default connect(mapStateToProps)(Addon);
