// 모듈 연결
import React, { Component , Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../../store";
// [ajax] axios 연결
import axios from 'axios';
// 컴포넌트 연결

class QRreade extends Component {

    state = {
        cheakMode : 'ClassTime',
        selectTime : false,
        selectHour : "",
        selectMin : "",
        classTime : false, 
        now : false,
        tardy : this.props.select.lateTime,
        absent : this.props.select.absentTime,
      }

    handle = () => {
        let uplodeTime
        console.log('주차:',this.props.week)
        let endTime = this.nearClassTime(this.props.select.classTime).endTime
        if(this.state.cheakMode == 'ClassTime'){
            uplodeTime = this.nearClassTime(this.props.select.classTime).startTime
        }
        if(this.state.cheakMode == 'NowTime'){
            let d = new Date();
            uplodeTime = d.getHours()*60 + d.getMinutes() 
        }
        if(this.state.cheakMode == 'SelectTime'){
            uplodeTime = this.state.selectTime
        }
        console.log('업로드시간',uplodeTime)
        if(0 <= uplodeTime && uplodeTime <1440 && typeof(uplodeTime)==="number"){
            if(!this.props.token){
                this.logout()
                return
            }
            if(this.props.week==null||this.props.week==NaN){
                this.logout()
                return
            }
            console.log('회차 생성중',this.props.select.id,uplodeTime,this.props.week)
            axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/qr/open?token='+this.props.token, {
                classListId: this.props.select.id,
                classStartTimeHour : uplodeTime,
                week : this.props.week,
            })
            .then( response => {
                if (response.message == "잘못된 토큰이 왔습니다."){
                    this.logout()
                    return
                }
                this.props.PanelSelect("QRactive")
                this.props.progressClassRecord({className: this.props.select.name,classTime: uplodeTime, endTime:endTime,classId:this.props.select.id, classWeek: this.props.week,color:this.props.cardColor[this.props.select.color]})
                console.log("QR코드 생성")
                this.props.loginSuccess(response.data.token)
            })
            .catch( error => {
                console.log(error)
            })
        }

    }
    cheakClick = (mode) =>{
        this.setState({
            cheakMode : mode,
        })   
    }
    hourChange = (e) => {
        let val = (e.target.value == '0'? 0 : parseInt(e.target.value) )
        if (val != 0 &&!parseInt(val)){
            this.setState({
                selectHour : "",
            })
        } 
        else if (val > 23){
            this.setState({
                selectHour : "",
            })
        }
        else {
            this.setState({
                selectHour : val,
                selectTime : val*60 + parseInt(this.state.selectMin),
            })
        }
        console.log(this.state.selectTime)
      }

    hourBlur = (e) =>{   
        if(e.target.value < 10){
            this.setState({
                selectHour : "0"+e.target.value,
            })           
        }
    }
    hourFocus = (e) =>{
        this.setState({
            selectHour : "",
        })                
    }
      
    minChange = (e) => {
        let val = (e.target.value == '0'? 0 : parseInt(e.target.value) )
        console.log("값:",val ,"표현식 :", this.state.selectMin,"왜지 :",parseInt(this.state.selectMin)==true)
        console.log("값:",parseInt(this.state.selectMin))    
        if (val != 0 &&!parseInt(val)){
            this.setState({
                selectMin : "",
            })
        } 
        else if (val > 59){
            this.setState({
                selectMin : "",
            })
        }
        else {
            this.setState({
                selectMin : val,
                selectTime : parseInt(this.state.selectHour)*60 + val,
            })
            console.log(this.state.selectTime)
        }
      }

    minBlur = (e) =>{   
        console.log("블러발동")
        console.log(e.target.value=="")
        if (e.target.value == ""){
            this.setState({
                selectMin : "00",
            }) 
        }
        else if (e.target.value < 10){
            this.setState({
                selectMin : "0"+e.target.value,
            })           
        }
    }

    minFocus = (e) =>{
        console.log("포커스 발동")
        this.setState({
            selectMin : "",
        })                
    }

    nearClassTime (classTime,mode='all'){
        let now = new Date
        let result
        let nearTime = null
        let near = Infinity
        let nowTime = now.getHours()*60+now.getMinutes()

        // 오늘과 같은 요일을 찾아 해당하는 객체만 리턴해준다.
        result = classTime.filter(list =>( list.day == now.getDay()))
        // 지금 시간과 가장 가까운 수업을 찾는다. 단 이미 지나간 수업은 찾지 않는다.
        for (let index = 0; index < result.length; index++) {
            
            let classTime = result[index].startTime+result[index].endTime
            if(classTime-nowTime > 0 ){
                if(near > classTime-nowTime){
                    near = classTime-nowTime
                    nearTime = index
                    console.log(near,'인덱스 : ',index)
                }
            }
        }
        // 만약 오늘 지금 시간 이후에 있는 수업이 있다면 리턴해준다.
        if (nearTime != null){ 
            return result[nearTime]
        }

        // 내일부터 다음주 같은 요일을 찾아 해당하는 객체만 리턴해준다.
        for (let day = 0; day < 7; day++) {
            result = classTime.filter(list =>( list.day == (now.getDay()+day+1>6 ?(now.getDay()+day+1)-7: now.getDay()+day+1)))
            if (result.length > 0 )break;
        }
        
        // 가장 빠른 수업을 찾는다.
        near = Infinity
        for (let index = 0; index < result.length; index++) {
            let classTime = result[index].startTime+result[index].endTime
            if(near > classTime-nowTime){
                near = classTime-nowTime
                nearTime = index
                console.log(near,'인덱스 : ',index)
            }
        }
        return result[nearTime]
    }

    startTime = (classTime) => {
        console.log(classTime)
        let nearTime = this.nearClassTime(classTime)
        console.log(nearTime)
        return Math.floor(nearTime.startTime/60) + ":" + (nearTime.startTime%60<10? "0"  +nearTime.startTime%60 : nearTime.startTime%60)
    }
    // 지금 시간을 계산하는 함수
    nowTime = () =>{
        let d = new Date();
        let now = d.getHours()*60 + d.getMinutes() 
        return now
    }
    // 지각시간을 계산해주는 함수
    timeCalculation = (time, mode="normal") => {
        console.log(this.state.absent,this.state.tardy)
        if (mode == "late"){
            time = time + this.state.tardy
        } 
        else if  (mode == "absent"){
            time = time + this.state.absent        
        }
        return (Math.floor(time/60)<10? "0"+Math.floor(time/60): Math.floor(time/60)) + ":" + (time%60<10? "0"  +time%60 : time%60)
    } 
    // 클릭한것의 배경색을 바꿔주는 함수
    thisSelect = (select, div) =>{
        if (div =='cheakText') {
            let css = {backgroundColor : '#c8c8c8'}
            if (select == this.state.cheakMode){
                css = {backgroundColor : this.props.cardColor[this.props.select.color][0]}
            }
            return css
        }
        else if (div =='cheakTimeSelect') {
            let css = {backgroundColor : '#F6F7F9'}
            if (select == this.state.cheakMode){
                css = {backgroundColor : '#FFFFFF'}
            }
            return css
        }
    }

    logout = () => {
        console.log('로그아웃')
        axios.get('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/logout')
        this.props.logout()
    }

    
    render() { 
        let bgColor={backgroundColor: this.props.cardColor[this.props.select.color][0]}
        let fontColor={color: this.props.cardColor[this.props.select.color][1]}
        const timeText = <span>{this.timeCalculation(this.state.selectTime,"late")} 부터 지각 {this.timeCalculation(this.state.selectTime,"absent")} 부터는 결석이 됩니다.</span>
        const selectText = <span>수업을 시작할 시간을 설정해주세요</span>
        return (
            <div id = "QRreadePanel">
                <div id ="cheakTime">
                    <div id ="QRreadePanelInfo"><span style={fontColor}>{this.props.week}회차</span> 수업의 출석체크를 진행합니다.</div>
                    <div className = "cheakTimeSelectZone">

                        <div id= "" className = "cheakTimeSelect" onClick={ () => this.cheakClick("ClassTime")} style={this.thisSelect('ClassTime','cheakTimeSelect')} >
                            <div className = "cheakTime"> {this.startTime(this.props.select.classTime)} </div>
                            <div className = "cheakText" style={this.thisSelect('ClassTime','cheakText')}>
                            <div className = "cheakTimeExplanation"> 수업시간으로 출석체크 </div>
                            <div className = "cheakTimeInfo"> <div className = "cheakTimeInfoTag"> </div>{this.timeCalculation(this.nearClassTime(this.props.select.classTime).startTime,"late")} 부터 지각 {this.timeCalculation(this.nearClassTime(this.props.select.classTime).startTime,"absent")} 부터는 결석이 됩니다.</div>
                            </div>
                        </div>
                        <div id= "" className = "cheakTimeSelect" onClick={ () => this.cheakClick("NowTime")} style={this.thisSelect('NowTime','cheakTimeSelect')} >
                            <div className = "cheakTime"> {this.timeCalculation(this.nowTime())} </div>
                            <div className = "cheakText" style={this.thisSelect('NowTime','cheakText')}>
                            <div className = "cheakTimeExplanation"> 현재시간으로 출석체크 </div>
                            <div className = "cheakTimeInfo"> <div className = "cheakTimeInfoTag"> </div>{this.timeCalculation(this.nowTime(),"late")} 부터 지각 {this.timeCalculation(this.nowTime(),"absent")} 부터는 결석이 됩니다.</div>
                            </div>
                        </div>
                        {/* <div id= "" className = "cheakTimeSelect" onClick={ () => this.cheakClick("SelectTime")} style={this.thisSelect('SelectTime','cheakTimeSelect')} >
                            <div className = "cheakTime cheakTimeUser"> 
                            <input className="inputLeft" placeholder="13" maxLength="2" value={this.state.selectHour} onChange={this.hourChange} onFocus={this.hourFocus} onBlur={this.hourBlur}/>:<input placeholder="00" maxLength="2" value={this.state.selectMin} onChange={this.minChange} onFocus={this.minFocus} onBlur={this.minBlur}/>
                            </div>
                            <div className = "cheakText" style={this.thisSelect('SelectTime','cheakText')}>
                            <div className = "cheakTimeExplanation"> 지정한 시간으로 출석체크 </div>
                            <div className = "cheakTimeInfo"> 
                                <div className = "cheakTimeInfoTag"> </div>  
                                {(this.state.selectTime ? timeText : selectText)}
                            </div>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div id ="QRreadeBnts">
                    <div id ="QRcodeSetBnt">출석시간 세부설정</div>
                    <div id ="QRcodeMakeBnt" style={bgColor} onClick={this.handle} >QR생성</div>
                </div>
            </div>
        );
    }
}
//export default Panel;
const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard,
    cardColor : state.cardColor,
    token :  state.jwtToken,
  })
function mapDispatchToProps(dispatch){
    return {
        loginSuccess : (token) => dispatch({type:'LOGINSUCCESS',jwt : token}),
        logout : () => dispatch({type:'LOGOUT'}),
        progressClassRecord : (record) => dispatch({type:'progressClassRecord',record:record}),
        PanelSelect : (mode) => dispatch({ type: "panelMode",panelMode :mode,force:true}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(QRreade);