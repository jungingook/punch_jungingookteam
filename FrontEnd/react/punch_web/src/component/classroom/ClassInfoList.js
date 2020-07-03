// 모듈 연결
import React, { Component } from 'react'; //리엑트 연결 
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결
import ClassInfo from './ClassInfo'; // 폰 인포 연결
import AddClass from './AddClass'; // 폰 인포 연결
import store from "../../store";
// [ajax] axios 연결
import axios from 'axios';

class ClassInfoList extends Component {
    // defaultProps[기본값 프로버티]
    static defaultProps = { 
        data: [],
    }
    state = {
        classLength : 0 // 수업의 숫자
    }

    listUpdata = () => {
        let classList
        if(!this.props.token){
            // this.logout()
            return
        }
        axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/classList?token='+this.props.token)
        .then( response => {
            if (response.message == "잘못된 토큰이 왔습니다."){
                // this.logout()
                return
            }
            classList = response.data.classList;
            console.log('수업 목록 리스트 : ',response)
            store.dispatch({ type: "classList",classList})
            this.props.loginSuccess(response.data.token)
            console.log('토큰 :',response.data.token)
            if (classList){
            this.setState({ classLength : classList.length });
            } else if (classList==null){
                this.setState({ classLength : 0 });                
            } 
        })
        .catch( error => {
            console.log('에러',error)
            this.setState({ classLength : -1 });
          })      
    }
    componentDidMount(){
        this.listUpdata()   
    }
    componentDidUpdate(){
        if(this.props.Refresh){
            this.props.classListRefresh(false)
            console.log(' 업데이트 새로고침됨 : ', this.props.Refresh)
            this.listUpdata()   
        }
       
    }

    render() {
      
        let list = ""
        if (this.state.classLength > 0 ){
            list = this.props.classList.map(
                info => (<ClassInfo key={info.id} info={info}/>)   
            );          
        } else if (this.state.classLength == -1){
            list = <div className="errorCard">⛔ERRRO : 서버와 연결 실패⛔<br/><span>인터넷이 연결이 끊어지거나 일시적인 서버 오류일 수 있습니다.</span></div> 
        } else{
            list = <div> <div className="emptyCard"> 아직 만들어진 수업이 없습니다.<br/> 첫 수업을 만들어보세요 </div>  <div className="guideNotice"> <div id = "SideBarAddClassGuide" className="emptyCardGuideButton"/> <div>버튼을 누르면 수업을 생성할 수 있습니다</div>  </div></div>
        }
        return (
            <div id="ClassInfoList">
                <div id = "ClassInfoListTitle"> 수업목록</div>
                {(this.props.addClass?<AddClass/>:"")}
                {list}    
            </div>
        );
      }      
}


function mapDispatchToProps(dispatch){
    return {
        loginSuccess : (token) => dispatch({type:'LOGINSUCCESS',jwt : token}),
        classListRefresh : (value) => dispatch({ type: "classListRefresh",refresh : value}),
        logout : () => dispatch({type:'LOGOUT'}),
    }
  }
const mapStateToProps = (state) => ({
    classList : state.classList,
    addClass :  state.addClass,
    Refresh : state.classListRefresh,
    token :  state.jwtToken
  })

export default connect(mapStateToProps,mapDispatchToProps)(ClassInfoList);