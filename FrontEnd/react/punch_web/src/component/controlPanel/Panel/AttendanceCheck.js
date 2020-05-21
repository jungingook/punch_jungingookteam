// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결
import AttendanceWeek from './AttendanceWeek'; // 패널 비활성화

// [리듀스]스토어 연결
import store from "../../../store";


class AttendanceCheck extends Component {

    state = {
        week : [{no : 1 ,attendance : 32,trady : 2,absent: 1},
                {no : 2 ,attendance : 33,trady : 1,absent: 1},
                {no : 3 ,attendance : 32,trady : 1,absent: 2},
                {no : 4 ,attendance : 32,trady : 2,absent: 1},
                {no : 5 ,attendance : 33,trady : 1,absent: 1},
                {no : 6 ,attendance : 32,trady : 1,absent: 2},
                {no : 7 ,attendance : 32,trady : 2,absent: 1},
                {no : 8 ,attendance : 33,trady : 1,absent: 1},
                {no : 9 ,attendance : 32,trady : 1,absent: 2},
                {no : 10 ,attendance : 32,trady : 2,absent: 1},
                {no : 11 ,attendance : 33,trady : 1,absent: 1},
                {no : 12 ,attendance : 32,trady : 1,absent: 2},
                {no : 13 ,attendance : 32,trady : 2,absent: 1},
                {no : 14 ,attendance : 33,trady : 1,absent: 1},
                {no : 15 ,attendance : 32,trady : 1,absent: 2},
                {no : 16 ,attendance : 32,trady : 2,absent: 1},
                {no : 17 ,attendance : 33,trady : 1,absent: 1},
                {no : 18 ,attendance : 32,trady : 1,absent: 2},
                {no : 19 ,attendance : 32,trady : 2,absent: 1},
                {no : 20 ,attendance : 33,trady : 1,absent: 1},
                {no : 21 ,attendance : 32,trady : 1,absent: 2},
        ]
    }
    

    render() {

            let list = this.state.week.map(
                info => (<AttendanceWeek key={info.no} select={this.props.select} data={info}/>)   
            );          


        return (
            <div id = "AttendanceCheckPanel">
                <div id = "AttendanceCheckPanelTitle" > 출석을 볼 수업 회차를 선택해주세요 </div>
                <div id="allWeek"> 
                    <div id="AttendanceViewSelect"> 모든 수업보기 
                    </div>
                    {list}
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

export default connect(mapStateToProps)(AttendanceCheck);