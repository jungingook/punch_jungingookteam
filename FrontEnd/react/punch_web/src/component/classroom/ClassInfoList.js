// 모듈 연결
import React, { Component } from 'react'; //리엑트 연결 
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결
import ClassInfo from './ClassInfo'; // 폰 인포 연결
import store from "../../store";

class ClassInfoList extends Component {
    // defaultProps[기본값 프로버티]
    static defaultProps = { 
        data: [],
    }
    state = {
        classLength : 0 // 수업의 숫자
    }

    componentWillMount() {
        this.setState({ classLength : this.props.classList.length });
      }
    render() {
        const list = this.props.classList.map(
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

const mapStateToProps = (state) => ({
    classList : state.classList
  })

export default connect(mapStateToProps)(ClassInfoList);