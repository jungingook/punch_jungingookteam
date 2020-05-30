// 모듈 연결
import React, { Component } from 'react'; //리엑트 연결 
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../store";
// [ajax] axios 연결
import axios from 'axios';

// 컴포넌트 연결
import AddTime from './AddTime';
import AddDate from './AddDate';
import AddTardy from './AddTardy';

class AddCalss extends Component {
    // defaultProps[기본값 프로버티]
    static defaultProps = { 
        data: [],
    }
    state = {
        classLength : 0, // 수업의 숫자
        className : '',
        classColor : 'blue',
        classDesign : 'default',
        startDay : false,
        endDay : false,
        tardy: 5,
        absent : 20, 
        // 애니메이션을 위한것
        moveAnimation : '-100vh',
        // 데이터 전달을 위한것
        classTimeListId : 1,
        classTimeList : [
            {
                id : 0,
            }],
        backClassTimeList : [],
        // 상태 파악을 위한것
        timeError : false,
        allReady : false, 
        messenger : "이름을 입력해주세요",
    }
    
    cardcolor = (position) => {
       return {backgroundColor:this.props.cardColor[this.state.classColor][position]}
    }
    nameChange = (e) =>{
        this.setState({
            className : e.target.value
        },()=>this.isReady()) 
    }
    colorChange = (color) =>{
        this.setState({
            classColor : color
        })
    }
    appendTime = () => {
        const { classTimeList } = this.state;
        this.setState({
            classTimeList : classTimeList.concat({ id: this.state.classTimeListId++}),
            timeError :  false,
        })
        console.log(this.state.classTimeList)
    }
    deleteTime = (id) => {
        const { classTimeList } = this.state;
        const { backClassTimeList } = this.state;
        if (Object.keys(this.state.classTimeList).length == 1){
            console.log('1개 이상의 시간이 있어야 합니다.')
            this.setState
            ({
                timeError :  '하나 이상의 수업시간이 있어야 합니다.'
            })
        } else {
            this.setState({
                classTimeList: classTimeList.filter(info => info.id !== id),
                backClassTimeList : backClassTimeList.filter(info => info.id !== id)
            })
        }
        console.log(this.state.classTimeList)
    }

    timeError = ()=>{
        if (this.state.timeError==false){
        return ""
        }
        return <div className = "timeError">{this.state.timeError}</div>
    }

    showAnimation = () => {
        const SetTime = setTimeout( ()=> {
            this.setState({
                moveAnimation: "0",
            })   
            }, 0);
            return () => clearTimeout(SetTime);
    }

    dayToNum = (day) => {

        return 
    }

    timeCallBack = (data=["","",""]) => {
        const { backClassTimeList } = this.state;
        let test = backClassTimeList.filter(info => info.id !== data[3])
        let weekday = {'일요일':0,'월요일':1,'화요일':2,'수요일':3,'목요일':4,'금요일':5,'토요일':6}
        this.setState({
            backClassTimeList : test.concat({ key:data[3], id:data[3], day: weekday[data[0]],startTime: data[1],endTime: data[2]}),
            timeError :  false,
        },()=>this.isReady())       
    }

    tardyCallBack = (tardy,absent) => {
        this.setState({
            tardy: tardy,
            absent : absent, 
        },()=>this.isReady())          
    }

    dateCallBack = (startDay,endDay) => {
        this.setState({
            startDay : startDay,
            endDay : endDay,
        },()=>this.isReady())          
    }
    // 시간을 계산해주는 함수
    timeCalculation = (time, mode="normal") => {
        if (mode == "late"){
            time = time + 5
        } 
        else if  (mode == "absent"){
            time = time + 20          
        }
        return (Math.floor(time/60)<10? "0"+Math.floor(time/60): Math.floor(time/60)) + " : " + (time%60<10? "0"  +time%60 : time%60)
    } 

    // 여러 수업시간중 최소 시간을 구하는 함수 지각 정책 설정을 위해 필요
    minTime = () =>{
        let maxVal = 30 
        if (this.state.backClassTimeList.length == 1){
            maxVal = this.state.backClassTimeList[0].endTime
        }
        else if (this.state.backClassTimeList.length != 0){
        maxVal = this.state.backClassTimeList.reduce((timeA,tiemB) => (timeA.endtTme < tiemB.endTime?timeA.endTime:tiemB.endTime))
       } 
       return maxVal
    }

    isReady = () =>{
        // 이름이 입력되지 않은 경우
        if (this.state.className == '') {
            this.setState({ allReady : false, messenger : "이름을 입력해주세요" }) 
            return 0 
        }
        if (this.state.backClassTimeList.length == 0) {
            this.setState({ allReady : false, messenger : "하나이상의 수업시간을 입력해주세요" })
            return 0 
        }
        // if (this.state.startDay == false || this.state.startDay == false ) {
        //     this.setState({ allReady : false, messenger : "수업기간을 입력해주세요" })
        //     return 0 
        // }
        this.setState({         
            allReady : true,
            messenger : "수업을 생성할 수 있습니다.", 
        })
        return 0
    }
    // 수업을 생성합니다.
    axios = () => {
        console.log(this.state.backClassTimeList) 
        console.log('수업생성 토큰 : ',this.props.token) 
        let InputClassTime = new Array()
        for (let index = 0; index < this.state.backClassTimeList.length; index++) {
            InputClassTime.push({startTime : this.state.backClassTimeList[index].startTime,endTime : this.state.backClassTimeList[index].endTime,day : this.state.backClassTimeList[index].day})
        }

        if (this.state.allReady){
            // console.log('수업이름 : ',this.state.className,'수업요일 : ',this.state.backClassTimeList[0].day,'수업시간 : ',this.state.backClassTimeList[0].startTime,'~',this.state.backClassTimeList[0].endTime,'수업 컬러  : ',this.state.classColor,'수업디자인 : ',this.state.classDesign,)
            // 임시로 다중 시간을 입력하지 않고 입력된 첫 시간만 보냄 
            axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/desk/professor/classList?token='+this.props.token, {
                InputClassName: this.state.className,
                InputClassTime : InputClassTime,
                inputClassColor : this.state.classColor,
                InputClassDesign : this.state.classDesign,
                InputClassCode: 500, // 해당 항목은 없어저야함
                // inputPrfessorId : 1, // 1 승진좌
            })
            .then( response => {
                console.log(response)
                this.props.loginSuccess(response.data.token)
                this.props.updata()
                this.props.addClassReturn()
            })
            .catch( error => {
                console.log(error)
            })
        }
    }

    render() {
        let output ;
        let classTimeText;
        let numToDay = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일']
        classTimeText = this.state.backClassTimeList.map(
            info => (<div className="classTimes" key={info.id}> {numToDay[info.day]} {this.timeCalculation(info.startTime)}~{this.timeCalculation(info.startTime+info.endTime)}</div>)   
        );
        // console.log("시간값:",classTimeText)
        output = this.state.classTimeList.map(
            info => (<AddTime key={info.id}  id={info.id} ondelete={this.deleteTime} dataBack={this.timeCallBack}/>)   
        );   

        

        let className = this.state.className;
        this.showAnimation()
        return (
            <div id="AddClassView" style={{top:this.state.moveAnimation}}>
                <div id="AddClassCard">   
                    <div id = "AddClassSidebar">
                        <div id="AddClassBackButton" className="SideButton" onClick={() => this.props.addClassReturn()}/>

                    </div>
                    <div id="CardMake">
                        <div className = "classCard" style={this.cardcolor(0)} >   
                            <div className = "classUpper">
                                <div className = "classCardBackground">
                                    <div className = "classOne classDesign"/>
                                    <div className = "classTwo classDesign"/>
                                </div>
                                <div className = "classInfo">
                                    <div className = "classDate classText"> {classTimeText} </div>
                                </div>
                            </div>
                            <div className = "classLower" style={this.cardcolor(1)} >
                                <div className = "className">{className}</div>
                            </div>
                        </div>
                        <div id = "AddClassSubmit"> 
                            <div id ="AddClassSubmitReason">
                            {this.state.messenger}
                            </div>
                            <div id = {(this.state.allReady? "AddClassSubmitButton" : "AddClassSubmitButtonReady")} className="transitionBackground" onClick={()=>this.axios()}> 수업만들기 </div>
                        </div>
                    </div>
                </div>

                <div id="AddClassSetting">  
                    <div className = "AddClassSelector"> 
                        <div className = "AddClassSelectorName">
                             수업 기본 정보
                        </div>
                        <div className = "AddClassSelectorInput">
                            <div className = "AddClassSelectorInfo">
                                수업명 : 
                            </div>
                            <input id="MakeClassName" placeholder="수업이름"  value={this.state.ClassName} onChange={this.nameChange} />
                        </div>
                        {output}
                        {this.timeError()}
                        <div id="AddClassTimeApeend" onClick={()=>this.appendTime()}> 수업시간 추가 </div>
                    </div>

                    <div className = "AddClassSelector"> 
                        <div className = "AddClassSelectorName">
                            수업 기간
                        </div>
                        <div className = "AddClassSelectorInput">
                            <AddDate dataBack={this.dateCallBack} />
                        </div>
                    </div>

                    <div className = "AddClassSelector"> 
                        <div className = "AddClassSelectorName">
                             색상과 디자인 선택
                        </div>
                        <div className = "AddClassSelectorInfo">
                            수업 카드의 색상을 선택합니다. 
                        </div>
                        <div className = "AddClassSelectorInput">
                            <div id="AddClassSelectorColorInput">
                                <div style={{backgroundColor:'#E93A2E'}} className = {(this.state.classColor == 'red' ? " SelectThisColor " : "AddClassSelectorColor" )} onClick={ () => this.colorChange('red')} ></div>
                                <div style={{backgroundColor:'#00B0F0'}} className = {(this.state.classColor == 'blue' ? " SelectThisColor " : "AddClassSelectorColor" )} onClick={ () => this.colorChange('blue')} ></div>
                                <div style={{backgroundColor:'#99C556'}} className = {(this.state.classColor == 'green' ? " SelectThisColor " : "AddClassSelectorColor" )} onClick={ () => this.colorChange('green')} ></div>
                                <div style={{backgroundColor:'#FFC000'}} className = {(this.state.classColor == 'yellow' ? " SelectThisColor " : "AddClassSelectorColor" )} onClick={ () => this.colorChange('yellow')} ></div>
                                <div style={{backgroundColor:'#E780BC'}} className = {(this.state.classColor == 'pink' ? " SelectThisColor " : "AddClassSelectorColor" )} onClick={ () => this.colorChange('pink')} ></div>
                                <div style={{backgroundColor:'#9949CE'}} className = {(this.state.classColor == 'purple' ? " SelectThisColor " : "AddClassSelectorColor" )} onClick={ () => this.colorChange('purple')} ></div>
                                <div style={{backgroundColor:'#595959'}} className = {(this.state.classColor == 'black' ? " SelectThisColor " : "AddClassSelectorColor" )} onClick={ () => this.colorChange('black')} ></div>
                            </div>
                        </div>
                        <div className = "AddClassSelectorInfo">
                            수업 카드의 디자인을 선택합니다.
                        </div>

                    </div>
                     <AddTardy times={this.minTime()} dataBack={this.tardyCallBack} />
                </div>
                <div id="AddClassDumi"/>  
            </div>
        );
      }      
}

const mapStateToProps = (state) => ({
    cardColor : state.cardColor,
    token :  state.jwtToken
  })

function mapDispatchToProps(dispatch){
    return {
        loginSuccess : (token) => dispatch({type:'LOGINSUCCESS',jwt : token}),
        addClassReturn : () => dispatch({type:'ADDCLASSBACK'}),
    }
  }
export default connect(mapStateToProps,mapDispatchToProps)(AddCalss);