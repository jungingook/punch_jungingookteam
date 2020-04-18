import React, { Component } from 'react'; //리엑트 연결 
import ClassInfo from './ClassInfo'; // 폰 인포 연결

class ClassInfoList extends Component {
    // defaultProps[기본값 프로버티]
    static defaultProps = { 
        data: [],
    }
    // 배열 받아오기
    id = 4 // 지금까지 배열에 가지고 있는 개수 
    state = {
        classList: [
        {
            id: 0,
            name: '수업 이름',
            professor: '담당 교수',
            code: '000000',
            day: 0,
            startTime: 600,
            endTime: 180,
            color :'#fff',
        },
        {
            id: 1,
            name: '소프트웨어 캡스톤디자인',
            professor: '이승진',
            code: '000001',
            day: 5,
            startTime: 540,
            endTime: 180,
            color :'#fff',
        },
        {
            id: 2,
            name: '하이브리드 앱',
            professor: '김명철',
            code: '000002',
            day: 4,
            startTime: 720,
            endTime: 180,
            color :'#fff',
        },
        {
            id: 3,
            name: '사회봉사',
            professor: '누군지 모름',
            code: '000003',
            day: 3,
            startTime: 900,
            endTime: 180,
            color :'#fff',
        }
        ],
    }
 
    handleCreate = (data) => {
    console.log(data)
    const { classList } = this.state;
    this.setState({
        classList: classList.concat({ id: this.id++, ...data })
    })
    }  
      
    render() {
        //const { data } = this.props;
        // 데이터를 받아옴 상위에서
        const list = this.state.classList.map(
            info => (<ClassInfo key={info.id} info={info}/>)
        );
        return (
            <div id="ClassInfoList">
                <div id = "ClassInfoListTitle"> 수업목록</div>
                {list}    
            </div>
        );
      }      
}
export default ClassInfoList;
