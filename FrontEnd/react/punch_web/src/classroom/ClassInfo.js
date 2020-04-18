import React, { Component } from 'react';

class ClassInfo extends Component {
    // defaultProps[기본값 프로버티]
    // 수업방에 대한 정보 기본 설정

    static defaultProps = {
        info: {
            id: 0,
            name: '수업 이름',
            professor: '담당 교수',
            code: '수업 코드',
            day: 0,
            startTime: 1100,
            endTime: 180,
            color :'#fff',
          }
    }

    handle = () => {
        localStorage.setItem('code', this.props.info.code);
        localStorage.setItem('name', this.props.info.name);
        localStorage.setItem('professor', this.props.info.professor);
        console.log("수업코드 : "+this.props.info.code)
    }

    date = (day,startTime,endTime) => {
        let weekday = new Array();
        weekday[0]="일요일"; weekday[1]="월요일"; weekday[2]="화요일"; weekday[3]="수요일"; weekday[4]="목요일"; weekday[5]="금요일"; weekday[6]="토요일";
        return weekday[day] +" "+ Math.floor(startTime/60) + " : " + (startTime%60<10? "0"  +startTime%60 : startTime%60 )+ " ~ " + Math.floor((startTime+endTime)/60) + " : " + ((startTime+endTime)%60<10? "0"  +(startTime+endTime)%60 : (startTime+endTime)%60 )
    }

    //랜더부
    render() {
        // prop의 정보를 상수로 만듭니다.
        const {
        day, startTime, endTime, name// , professor, code, id // 사용하지 않는 상수
        } = this.props.info;
        // 날짜변환기
        return (
        <div className = "classCard" onClick={this.handle}>   
            <div className = "classUpper">
                <div className = "classCardBackground">
                    <div className = "classOne classDesign"/>
                    <div className = "classTwo classDesign"/>
                </div>
                <div className = "classInfo">
                    <div className = "classDate classText">{this.date(day,startTime,endTime)}</div>
                    {/* <div className = "classProfessor classText">{professor}</div> */}
                </div>
            </div>
            <div className = "classLower">
                <div className = "className">{name}</div>
            </div>
        </div>
        );
    }
}

export default ClassInfo;
