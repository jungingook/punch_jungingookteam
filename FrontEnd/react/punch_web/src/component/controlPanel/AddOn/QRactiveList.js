// 모듈 연결
import React, { Component , Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../../store";
// 컴포넌트 연결
import AttendanceUser from './AttendanceUser'; // 학생출석표 생성 
// [ajax] axios 연결
import axios from 'axios';

class QRactiveList extends Component {
    state = {
        search : '',
        student : [],
        attend: 0,
        tardy : 0,
        absent : 0,

    }
    studentSearch = (e) => {
        this.setState({
            search : e.target.value,
        })
    }
    componentDidMount() {
        this.userChange()
        let UserInterval = setInterval(this.userChange, 3000, "1초 간격")
        this.setState({
           Interval : UserInterval
        },)

     }
     componentWillUnmount(){
       clearInterval(this.state.Interval)
       console.log('인터벌 헤제')
     }

     userChange = () => {
        console.log('보내는값 : ',this.props.selectCard,this.props.week)
        // 에러@@@@@@@@@@@@@@@@@@@@@@ 쿼리값 정해야함
        axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/classList/attendance?token='+this.props.token+'&classListID='+this.props.selectCard+"&att_week="+this.props.week
        // ,{
        //     classListID : this.props.selectCard,
        //     att_week : this.props.week,
        // }, { credentials: true }
        )
        .then( response => {
            console.log('출석 리스트 받아오기: ','주차',response.data)
            // this.props.loginSuccess(response.data.token)
            if (response.data.att_arr){
                this.setState({
                    student : response.data.att_arr,
                    attend: response.data.attend_count,
                    tardy : response.data.late_count,
                    absent : response.data.absent_count,
                })
            } else {
                this.setState({
                    student : [],
                })   
            }
        })
        .catch( error => {
            console.log('출석 리스트 에러 ',error)   
            })    
    }

    
    
    render() { 
        let result  

        if (Number(this.state.search)|| this.state.search =='0'){
            // console.log('학번으로 검색')
            result = this.state.student.filter(s =>((s.studentNo+'').search(this.state.search) != -1))
        }else {
            // console.log('이름으로 검색')
            result = this.state.student.filter(s =>(s.name.search(this.state.search) != -1));
        }
        
        // console.log('렌더',result)
        let show = result.map(
            info => (info.studentNo)   
        );    
        let appear = 1
        let list = this.state.student.map(
            info => (<AttendanceUser key={info.studentNo} appear={appear++} student={info} order={info.name.search(this.state.search)} show={(show.indexOf(info.studentNo) == -1 ? false : true )}  studentNo={info.studentNo}  attendTime={info.attendTime} />)   
        );      

        return (
            <div id ="QRactivePanelList">
                <div id = "QRactiveSearch">
                    <div id = "AttendWeekInfoButton">
                        <div className= "AttendInfoinput" > <span>학생 검색 : </span><input placeholder="학번 또는 이름" onChange={this.studentSearch}/> </div>
                        <div className="AttendInfoButton" > 미 출석자</div>   
                        <div className="AttendInfoButton" > 출석자</div>               
                    </div>
                </div>
                <div id ="attendancelist"> 
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
    token :  state.jwtToken,
    week :  state.qrCreactWeek,
  })

function mapDispatchToProps(dispatch){
return {
    loginSuccess : (token) => dispatch({type:'LOGINSUCCESS',jwt : token}),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(QRactiveList);