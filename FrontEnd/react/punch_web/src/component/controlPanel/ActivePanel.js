// 모듈 연결
import React, { Component , Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../store";
// 컴포넌트 연결
import SelectPanel from './SelectPanel'; // 선택메뉴
import QRreade from './QRreade'; // 출석체크 선택메뉴


class ActivePanel extends Component {

    date = (day,startTime,endTime) => {
        let weekday = new Array();
        weekday[0]="일요일"; weekday[1]="월요일"; weekday[2]="화요일"; weekday[3]="수요일"; weekday[4]="목요일"; weekday[5]="금요일"; weekday[6]="토요일";
        return weekday[day] +" "+ Math.floor(startTime/60) + " : " + (startTime%60<10? "0"  +startTime%60 : startTime%60 )+ " ~ " + Math.floor((startTime+endTime)/60) + " : " + ((startTime+endTime)%60<10? "0"  +(startTime+endTime)%60 : (startTime+endTime)%60 )
    }

    panel = (mode) => {
        let output = <div>오류 : 패널의 mode가 없음</div>
        if (mode == "Error") {
            output = <div>오류 : 패널의 mode가 없음</div>
        }
        else if (mode == "Select") {
            output = <SelectPanel color={this.props.select.color}/>
        }
        else if (mode == "QRreade") {
            output = <QRreade/>
        }
        else if (mode == "QRactive") {
            output = <div>QRactive</div>
        }
        return output
    }

    render() { 
        // let output = <div>오류 : 패널의 mode가 없음</div>
        // if (this.props.panelMode == "Error") {
        //     output = <SelectPanel color={this.props.select.color}/>
        // }
        // else if (this.props.panelMode == "Select") {
        //     output = <SelectPanel color={this.props.select.color}/>
        // }
        // else if (this.props.panelMode == "QRreade") {
        //     output = <SelectPanel color={this.props.select.color}/>
        // }
        // else if (this.props.panelMode == "QRactive") {
        //     output = <SelectPanel color={this.props.select.color}/>
        // }
        return (
            <Fragment>
                <div id = "TitlePanel">
                    <div id="TitlePanelTime">
                        {this.date(this.props.select.day,this.props.select.startTime,this.props.select.endTime)}
                    </div>
                    <div id = "TitlePanelName">
                        {this.props.select.name}
                    </div>
                </div>
                <div id = "PanelField">
                    {this.panel(this.props.panelMode)}
                </div>
            </Fragment>
        );
    }
}
//export default Panel;
const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard,
    panelMode : state.panelMode,
  })

export default connect(mapStateToProps)(ActivePanel);