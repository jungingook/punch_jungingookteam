import React, { Component } from 'react';

class ClassInfo extends Component {
    // defaultProps[기본값 프로버티]
    // 수업방에 대한 정보 기본 설정
    static defaultProps = {
        info: {
            id: 0,
            name: '수업 이름',
            professor: '담당 교수',
            code: '수업 코드'
          }
    }

    handle = () => {
        localStorage.setItem('code', this.props.info.code);
        localStorage.setItem('name', this.props.info.name);
        localStorage.setItem('professor', this.props.info.professor);
        console.log("수업코드 : "+this.props.info.code)
    }
    //랜더부
    render() {
        // prop의 정보를 상수로 만듭니다.
        const {
        name, professor, code, id
        } = this.props.info;
        
        return (
        <div className = "ClassInfo" onClick={this.handle}>
            <div className = "ClassName"><b>{name}</b></div>
            <div className = "ClassProfessor">{professor}</div>
        </div>
        );
    }
}

export default ClassInfo;
