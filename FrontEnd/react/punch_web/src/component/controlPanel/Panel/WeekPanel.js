// 모듈 연결
import React, { Component,Fragment } from 'react';
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
        delete : false,
        showObj : 1,
    }
    
    logout = () => {
        console.log('로그아웃')
        axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/logout')
        this.props.logout()
    }

    lengthControl = () => {
        this.setState ({
            length : this.state.length - 1,
            showObj : this.state.showObj + 1,
            overlap : false,
        })
    }

    componentDidMount() {
        console.log('수업생성제한 : ',this.props.intervalTime )
        if(this.props.intervalTime > 0){
            this.setState({overlap : true})
        }
        console.log("출석리스트 받아오기 : ",this.props.selectCard)
        if(!this.props.token){
            this.logout()
            return
        }

        axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/classList/attendance?token='+this.props.token+'&classListID='+this.props.select.id
        // , {
        //     classListID : this.props.select.id
        // }
        )
        .then( response => {
            if (response.message == "잘못된 토큰이 왔습니다."){
                this.logout()
                return
            }
            console.log('리스트',response.data)
            let list = response.data.result_arr.filter((week) => week!=null)
            this.setState({
                week : list,
                length : list.length,
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
            console.log('테스트 :',this.state.week.length < this.state.showObj)
            if(this.state.week.length >= this.state.showObj){
            list = this.state.week.map(
                info => (<WeekList key={info.week} select={this.props.select} data={info} last={this.state.week[this.state.week.length-this.state.showObj].week==info.week} back={this.lengthControl} overlap={this.state.overlap} delete={this.state.delete}/>)   
            );   
            }
   
        }
        let zoneSize = this.state.length *18 + 18+ 18
        let zoneMove = -this.state.length *18 + (nextWeek==1? 0:18)
        if(this.state.overlap){
            if(this.state.nextWeek==2){
                zoneSize = this.state.length *18
                zoneMove = 0
            }else{
                zoneSize = this.state.length *18
                zoneMove = -this.state.length *18 + 36
            }
            // nextWeek 가 2인 이유는 중복된 수업이 생성되려면 next week 2가 최소값
        }
        if (zoneMove > 0 ) {zoneMove= 0 }
        console.log('지금의 주차:',nextWeek)
        return (
            <Fragment>
            {this.state.overlap==true ? 
                <div id = "WeekPanel">
                    
                    <div id = 'WeekPanelInfoZone'>
                        <div id = 'WeekPanelInfo'>
                            <span style={fontColor}>{this.props.lastTime}분전</span> 출석체크를 진행한 기록이 있습니다.
                        </div>
                        {!this.state.delete? 
                        <div id = 'WeekListdel'  onClick={()=> this.setState({delete:true})}/>
                        :
                        <div id = 'WeekListdel'  onClick={()=> this.setState({delete:false})} style={{backgroundColor:'#999'}}/>
                        }
                    </div>
                    <div id='SelectWeekZone'>

                        <div id='WeekList' style={{width:zoneSize+ 'vw',marginLeft:zoneMove+ 'vw'}}>
                            {nextWeek!=1?list:''}
                            {nextWeek==null||this.state.overlap==true ? '':<WeekListAdd week={nextWeek} bg={bgColor} select={this.selectButton}  color={bgColor}/>}
                        </div>
                            {nextWeek!=2?
                            <div id='SelectWeekInfo'>
                                <div id='SelectWeekInfoMessage' style={{visibility:'hidden'}}></div>
                                <div id='SelectWeekInfoMessage'>이전 출석체크를 이어서 합니다.</div>
                            </div>
                            :
                            <div id='SelectWeekInfo'>
                                <div id='SelectWeekInfoMessageFast'>이전 출석체크를 이어서 합니다.</div>
                            </div>
                            }
                    </div>
                </div>
                :
                <div id = "WeekPanel">    
                    <div id = 'WeekPanelInfoZone'>
                        <div id = 'WeekPanelInfo'>
                        새로운 출석 체크를 진행하시려면<span style={fontColor}> {nextWeek}주차</span>를 선택해주세요<br/>지난 출석체크를 이어서 하시려면 {nextWeek-1}주차를 선택해주세요
                        </div>
                        {!this.state.delete? 
                        <div id = 'WeekListdel'  onClick={()=> this.setState({delete:true})}/>
                        :
                        <div id = 'WeekListdel'  onClick={()=> this.setState({delete:false})} style={{backgroundColor:'#999'}}/>
                        }
                    </div>

                    <div id='SelectWeekZone'>

                        <div id='WeekList' style={{width:zoneSize+ 'vw',marginLeft:zoneMove+ 'vw'}}>
                            {nextWeek!=1?list:''}
                            {nextWeek==null||this.state.overlap==true ? '':<WeekListAdd week={nextWeek-this.state.showObj+1} bg={bgColor} select={this.selectButton} color={bgColor}/>}
                        </div>
                            {nextWeek-this.state.showObj+1!=1?
                            <div id='SelectWeekInfo'>
                                <div id={nextWeek==2?"SelectWeekInfoMessageFast":"SelectWeekInfoMessage"}>지난 출석체크를 이어서 합니다.</div>
                                <div id={nextWeek==2?"SelectWeekInfoMessageFast":"SelectWeekInfoMessage"}>새로운 출석체크를 합니다.</div>
                            </div>
                            :
                            <div id='SelectWeekInfo'>
                                <div id='SelectWeekInfoMessageFast'>새로운 출석체크를 합니다.</div>
                            </div>
                            }
                    </div>
                </div>
            }
           </Fragment>
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