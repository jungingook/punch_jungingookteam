import React, { Component } from 'react';
var QRCode = require('qrcode.react');
class QR extends Component {
    state = {
        qrCode: "0000",
        classCode : localStorage.getItem('code'),
        className : localStorage.getItem('name'),
        classProfessor : localStorage.getItem('professor'),
    }
    qrChange = () => {
        let random = Math.floor(Math.random() * (9999999999 - 1000000000 + 1) + 1000000000)
        this.setState({
            qrCode: random,
            classCode : localStorage.getItem('code'),
            className : localStorage.getItem('name'),
            classProfessor : localStorage.getItem('professor'),
          });
        console.log(this.state.qrCode+this.state.classCode)
    }
    componentWillMount() {
        setInterval(this.qrChange, 1000, "1초 간격")
      }
    render() {
        return (
        <div id = "qr">
            <QRCode id="temp" value={this.state.qrCode+this.state.classCode} renderAs="canvas" bgColor="#ffffff00"/>
            <div id="tempClass"> 
                <div id="className">{this.state.className}</div> 
                <div id="classProfessor">{this.state.classProfessor}</div> 
            </div>
        </div>
        );
    }
}
export default QR;


