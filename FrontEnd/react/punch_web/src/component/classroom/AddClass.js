// 모듈 연결
import React, { Component } from 'react'; //리엑트 연결 
import { connect } from "react-redux"; // 리덕스 연결
// [리듀스]스토어 연결
import store from "../../store";
// [ajax] axios 연결
import axios from 'axios';

// 컴포넌트 연결
import AddTime from './AddTime';

class AddCalss extends Component {
    // defaultProps[기본값 프로버티]
    static defaultProps = { 
        data: [],
    }
    state = {
        classLength : 0, // 수업의 숫자
        className : '',
        classTime : '',
        classColor : 'blue',
        // 애니메이션을 위한것
        moveAnimation : '-100vh',
        classTimeListId : 1,
        classTimeList : [
            {
                id : 0,
            }],
        backClassTimeList : [],
        timeError : false,
    }
    
    cardcolor = (position) => {
       return {backgroundColor:this.props.cardColor[this.state.classColor][position]}
    }
    nameChange = (e) =>{
        this.setState({
            className : e.target.value
        })
    }
    timeChange = (e) => {
        this.setState({
            classTime : e.target.value
        })
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

    timeCallBack = (data=["","",""]) => {
        const { backClassTimeList } = this.state;
        let test = backClassTimeList.filter(info => info.id !== data[3])

        this.setState({
            backClassTimeList : test.concat({ key:data[3], id:data[3], day: data[0],startTime: data[1],endTime: data[2]}),
            timeError :  false,
        })       
    }
    // 시간을 계산해주는 함수
    timeCalculation = (time, mode="normal") => {
        if (mode == "late"){
            time = time + 5
        } 
        else if  (mode == "absent"){
            time = time + 20          
        }
        return (Math.floor(time/60)<10? "0"+Math.floor(time/60): Math.floor(time/60)) + ":" + (time%60<10? "0"  +time%60 : time%60)
    } 


    render() {
        let output ;
        let classTimeText;
        classTimeText = this.state.backClassTimeList.map(
            info => (<div className="classTimes" key={info.id}> {info.day}{this.timeCalculation(info.startTime)}~{this.timeCalculation(info.startTime+info.endTime)}</div>)   
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
                    </div>
                </div>
                <div id="AddClassSetting">  
                    <div className = "AddClassSelector"> 
                        <div className = "AddClassSelectorName">
                             수업 기본 정보
                        </div>
                        {/* <div className = "AddClassSelectorInfo">
                             수업의 이름
                        </div> */}
                        <div className = "AddClassSelectorInput">
                            <div className = "AddClassSelectorInfo">
                                수업명 : 
                            </div>
                            <input id="MakeClassName" placeholder="수업이름"  value={this.state.ClassName} onChange={this.nameChange} />
                        </div>
                        {output}
                        {this.timeError()}
                        <div id="AddClasApeend" onClick={()=>this.appendTime()}> 수업시간 추가 </div>
                        
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

                    <div className = "AddClassSelector"> 
                        <div className = "AddClassSelectorName">
                             수업 정책 선택
                        </div>
                        <div className = "AddClassSelectorInfo">
                             인포
                        </div>
                        <div className = "AddClassSelectorInput">
                             셀렉터 이름
                        </div>
                    </div>

                </div>
                <div id="AddClassDumi"/>  
            </div>
        );
      }      
}

const mapStateToProps = (state) => ({
    cardColor : state.cardColor
  })
export default connect(mapStateToProps)(AddCalss);