// 모듈 연결
import React, { Component , Fragment } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../store";
// [ajax] axios 연결
import axios from 'axios';
// 컴포넌트 연결



class QRreade extends Component {

    state = {
        cheakMode : 'ClassTime',
        selectTime : false,
        selectHour : "",
        selectMin : "",
      }


    handle = () => {
        store.dispatch({ type: "panelMode",panelMode : "QRactive"})
        axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/classList/qr/open', {
            classListId: this.props.select.id,
            classHour : 1200,
          })
        .then( response => {
            console.log("QR코드 생성")
        })
        .catch( error => {
            console.log(error)
          })
    }
    cheakClick = (mode) =>{
        console.log("반복",mode)
        this.setState({
            cheakMode : mode,
        })   
    }
    hourChange = (e) => {
        let val = (e.target.value == '0'? 0 : parseInt(e.target.value) )
        console.log("값:",val ,"표현식 :", this.state.selectHour,"왜지 :",parseInt(this.state.selectHour)==true)
        console.log("값:",parseInt(this.state.selectHour))    
        if (val != 0 &&!parseInt(val)){
            this.setState({
                selectHour : "",
            })
        } 
        else if (val > 24){
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

    startTime = (startTime) => {
        return Math.floor(startTime/60) + ":" + (startTime%60<10? "0"  +startTime%60 : startTime%60 )
    }
    // 지금 시간을 계산하는 함수
    nowTime = () =>{
        let d = new Date();
        let now = d.getHours()*60 + d.getMinutes() 
        return now
    }
    // 지각시간을 계산해주는 함수
    timeCalculation = (time, mode="normal") => {
        if (mode == "late"){
            time = time + 5
        } 
        else if  (mode == "absent"){
            time = time + 20          
        }
        return Math.floor(time/60) + ":" + (time%60<10? "0"  +time%60 : time%60 )
    } 
    // 클릭한것의 배경색을 바꿔주는 함수
    thisSelect = (select) =>{
        let css = {backgroundColor : '#c8c8c8'}
        if (select == this.state.cheakMode){
            css = {backgroundColor : this.props.cardColor[this.props.select.color][0]}
        }
        return css
    }
    render() { 

        let bgColor={backgroundColor: this.props.cardColor[this.props.select.color][0]}
        const timeText = <span>{this.timeCalculation(this.state.selectTime,"late")} 부터 지각 {this.timeCalculation(this.state.selectTime,"absent")} 부터는 결석이 됩니다.</span>
        const selectText = <span>수업을 시작할 시간을 설정해주세요</span>

        return (
            <div id = "QRreadePanel">
                <div id ="cheakTime">
                    {/* <div className ="QRreadePanelSetsummar">출석체크 시간을 선택합니다.</div> */}
                    <div className = "cheakTimeSelectZone">

                        <div id= "" className = "cheakTimeSelect" onClick={ () => this.cheakClick("ClassTime")}>
                            <div className = "cheakTime"> {this.startTime(this.props.select.startTime)} </div>
                            <div className = "cheakText" style={this.thisSelect('ClassTime')}>
                            <div className = "cheakTimeExplanation"> 수업시간으로 출석체크 </div>
                            <div className = "cheakTimeInfo"> <div className = "cheakTimeInfoTag"> </div>{this.timeCalculation(this.props.select.startTime,"late")} 부터 지각 {this.timeCalculation(this.props.select.startTime,"absent")} 부터는 결석이 됩니다.</div>
                            </div>
                        </div>
                        <div id= "" className = "cheakTimeSelect" onClick={ () => this.cheakClick("NowTime")}>
                            <div className = "cheakTime"> {this.timeCalculation(this.nowTime())} </div>
                            <div className = "cheakText" style={this.thisSelect('NowTime')}>
                            <div className = "cheakTimeExplanation"> 지금시간으로 출석체크 </div>
                            <div className = "cheakTimeInfo"> <div className = "cheakTimeInfoTag"> </div>{this.timeCalculation(this.nowTime(),"late")} 부터 지각 {this.timeCalculation(this.nowTime(),"absent")} 부터는 결석이 됩니다.</div>
                            </div>
                        </div>
                        <div id= "" className = "cheakTimeSelect" onClick={ () => this.cheakClick("SelectTime")}>
                            <div className = "cheakTime cheakTimeUser"> 
                            <input className="inputLeft" placeholder="13" maxLength="2" value={this.state.selectHour} onChange={this.hourChange} onFocus={this.hourFocus} onBlur={this.hourBlur}/>:<input placeholder="00" maxLength="2" value={this.state.selectMin} onChange={this.minChange} onFocus={this.minFocus} onBlur={this.minBlur}/>
                            </div>
                            <div className = "cheakText" style={this.thisSelect('SelectTime')}>
                            <div className = "cheakTimeExplanation"> 지정한 시간으로 출석체크 </div>
                            <div className = "cheakTimeInfo"> 
                                <div className = "cheakTimeInfoTag"> </div>  
                                {(this.state.selectTime ? timeText : selectText)}
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id ="QRreadeBnts">
                    <div id ="QRcodeSetBnt">세부설정</div>
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
    cardColor : state.cardColor
  })

export default connect(mapStateToProps)(QRreade);