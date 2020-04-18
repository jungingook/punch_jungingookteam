// 모듈 연결
import React, { Component } from 'react';
import { connect } from "react-redux"; // 리덕스 연결
// 컴포넌트 연결
import Standby from './Standby'; // 폰 인포 연결
// [리듀스]스토어 연결
import store from "../../store";
class Panel extends Component {
    state = {

    }
    componentWillMount() {

    }
    render() {
        let mode = <Standby/>;
        if(this.props.selectCard != null){
            console.log(this.props.selectCard+"카드 선택")
        }
        return (
            <div id = "Panel">
                <div id = "PanelBox">
                    {mode}
                </div>
            </div>
        );
    }
}
//export default Panel;
const mapStateToProps = (state) => ({
    classList : state.classList,
    selectCard : state.selectCard
  })

export default connect(mapStateToProps)(Panel);