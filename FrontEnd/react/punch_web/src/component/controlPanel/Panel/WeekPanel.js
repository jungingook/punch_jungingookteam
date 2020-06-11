// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결

// [리듀스]스토어 연결
import store from "../../../store";
// [ajax] axios 연결
import axios from 'axios';

// 컴포넌트 연결
import WeekList from './WeekList'; // QR코드 체크
import WeekListAdd from './WeekListAdd'; // QR코드 체크

// 출석체크의 중복이 의심되는 경우 표시해주는 페이지
class WeekPanel extends Component {

    state = {
        week : 'lode',
        length : 0,
        overlap : false,
    }
    
    logout = () => {
        console.log('로그아웃')
        axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/logout')
        this.props.logout()
    }

    componentDidMount() {
        if(this.props.intervalTime > 0){
            this.setState({overlap : true})
        }
        console.log("출석리스트 받아오기 : ",this.props.selectCard)
        if(!this.props.token){
            this.logout()
            return
        }

        axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/classList/attendance?token='+this.props.token, {
            classListID : this.props.select.id
        })
        .then( response => {
            if (response.message == "잘못된 토큰이 왔습니다."){
                this.logout()
                return
            }
            console.log('리스트',response.data)
            let list = response.data.result_arr.filter((week) => week!=null)
            this.setState({
                week : list,
                length : list.length
            })
        })
        .catch( error => {
            this.logout()
            console.log('에러',error)
            this.setState({
                week : false
            })
        })
    }

    render() {
        let bgColor={backgroundColor: this.props.cardColor[this.props.select.color][0]}
        let fontColor={color: this.props.cardColor[this.props.select.color][1]}

        let list = <div> </div> 
        let show = false
        let nextWeek = null
        if(!this.state.week){
            list = <div> <div>에러</div> </div>
        }
        else if(this.state.week=='lode'){
            list = <div> </div>
        }
        else if(this.state.week.length == 0){
            nextWeek = 1
        }
        else{
            
            nextWeek = this.state.week[this.state.week.length-1].week+1
            show = true
            list = this.state.week.map(
                info => (<WeekList key={info.week} select={this.props.select} data={info} last={this.state.week[this.state.week.length-1].week==info.week} overlap={this.state.overlap}/>)   
            );      
            
        }
        let zoneSize = this.state.length *18 + 18
        let zoneMove = -this.state.length *18 + (nextWeek==1? 0:18)
        if(this.state.overlap){
            zoneSize = this.state.length *18
            zoneMove = -this.state.length *18 + 36

        }
        return (
            <div id = "WeekPanel">
                {
                this.state.overlap==true ? 
                <div id = 'WeekPanelInfo'>
                    <span style={fontColor}>{this.props.lastTime}분전</span> 출석체크를 진행한 기록이 있습니다. <br/>
                    이어서 출석체크를 하시려면 <span style={fontColor}> {nextWeek-1}주차를</span>  선택해주세요
                </div>
                :
                <div id = 'WeekPanelInfo'>
                새로운 출석 체크를 진행하시려면<span style={fontColor}> {nextWeek}주차</span>를 선택해주세요<br/>지난 출석체크를 이어서 하시려면 {nextWeek-1}주차를 선택해주세요 <br/>
                </div>              
                }
                <div id='SelectWeekZone'>
                    <div id='WeekList' style={{width:zoneSize+ 'vw',marginLeft:zoneMove+ 'vw'}}>
                        {list}
                        {nextWeek==null||this.state.overlap==true ? '':<WeekListAdd week={nextWeek} bg={bgColor} select={this.selectButton}  color={bgColor}/>}
                    </div>
                    <div id='WeekListSelectInfo'>
                        <div>

                        </div>
                        <div>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch){
    return {
        logout : () => dispatch({type:'LOGOUT'}),
        PanelSelect : (mode) => dispatch({ type: "panelMode",panelMode :mode}),
    }
  }
const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard,
    cardColor : state.cardColor,
    token :  state.jwtToken,

  })

export default connect(mapStateToProps,mapDispatchToProps)(WeekPanel);