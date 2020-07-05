// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";

// 컴포넌트 연결
import QRcode from './QRcode'; // 큐알코드 생성 
import AttendWeekView  from './AttendWeekView'; // 큐알코드 생성 

class InfoZone extends Component {
    zone = (mode) => {
        let output = <div>오류 : 패널의 mode가 없음</div>
        if (mode == "Error") {
            output = <div>오류 : 패널의 mode가 없음</div>
        }
        else if (mode == "QRactive") {
            output = <QRcode select={this.props.select}/>
        }
        else if (mode == "AttendanceWeek") {
            output = <AttendWeekView select={this.props.select}/>
        }
        else {
            output = <div id ="nullZone" />
        }
        return output

    }

    render() {

        return (
            <div id = "infoZone">
                {this.zone(this.props.panelMode)}
            </div>
            
        );
    }
}

const mapStateToProps = (state) => ({
    panelMode : state.panelMode,
  })

export default connect(mapStateToProps)(InfoZone);
