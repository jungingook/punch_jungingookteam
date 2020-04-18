import React, { Component } from 'react';
import Standby from './Standby'; // 폰 인포 연결
class Panel extends Component {
    state = {

    }
    componentWillMount() {

      }
    render() {
        return (
            <div id = "Panel">
                <div id = "PanelBox">
                    <Standby/>
                </div>
            </div>
        );
    }
}
export default Panel;


