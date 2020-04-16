import React, { Component } from 'react'; //리엑트 연결 
import ClassInfo from './ClassInfo'; // 폰 인포 연결

class ClassInfoList extends Component {
    // defaultProps[기본값 프로버티]
    static defaultProps = { 
        data: [],
      }
    render() {
        const { data } = this.props;
        // 데이터를 받아옴 상위에서
        const list = data.map(
            info => (<ClassInfo key={info.id} info={info}/>)
        );
        return (
            <div id="ClassList">
                <div id ="ListName"> 수업 목록 </div>
                <div id="List" >
                    {list}    
                </div>
            </div>
        );
      }      
}
export default ClassInfoList;
