import React, { Component } from 'react';

class Standby extends Component {
    state = {

    }
    componentWillMount() {

      }
    render() {
        return (
            <div>
                <div id ="StandbyUpper">
                    <img id="StandbyLogo" src={ require('../../../img/logo.png') }/>
                </div>
                <div id ="StandbyLower">
                    왼쪽에서 수업을<br/>선택해주세요
                </div>
            </div>
        );
    }
}
export default Standby;
