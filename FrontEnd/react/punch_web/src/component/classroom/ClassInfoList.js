// 모듈 연결
import React, { Component } from 'react'; //리엑트 연결 
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결
import ClassInfo from './ClassInfo'; // 폰 인포 연결
import store from "../../store";
// [ajax] axios 연결
import axios from 'axios';

class ClassInfoList extends Component {
    // defaultProps[기본값 프로버티]
    static defaultProps = { 
        data: [],
    }
    state = {
        //classLength : 0 // 수업의 숫자
        // 테스트시
        classLength : 5 // 수업의 숫자
    }

    componentWillMount() {

        let classList
        // axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/main')
        // .then( response => {
        //     classList = response.data;
        //     store.dispatch({ type: "classList",classList})
        //     this.setState({ classLength : classList.length });
        // })
        // .catch( error => {
        //     this.setState({ classLength : -1 });
        //   })
      }
    render() {
        let list = ""
        console.log(this.state.classLength)
        if (this.state.classLength > 0){
            list = this.props.classList.map(
                info => (<ClassInfo key={info.id} info={info}/>)   
            );          
        } else if (this.state.classLength == -1){
            list = <div className="errorCard">⛔ERRRO : 서버와 연결 실패⛔<br/><span>인터넷이 연결이 끊어지거나 일시적인 서버 오류일 수 있습니다.</span></div> 
        } else{
            list = <div className="errorCard">수업이 없습니다.<span>새로운 수업을 생성해보세요.</span></div> 
        }
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