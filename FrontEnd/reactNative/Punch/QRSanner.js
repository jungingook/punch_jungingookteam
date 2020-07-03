import * as React from 'react';
import { Text, View, StyleSheet, Button,ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import { BarCodeScanner } from 'expo-barcode-scanner';
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'
// [ajax] axios 연결
import axios from 'axios';
// 컴포넌트 연결
import ScannerControl from './component/qrScanner/ScannerControl';

// export default class BarcodeScannerExample extends React.Component {
class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
    control : "QRSCAN"
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <ActivityIndicator size="large"/>
    }
    if (hasCameraPermission === false) {
      return <Text>카메라에 연결할수 없습니다.</Text>;
    }
    return (
      <View
        style={{
          position: 'absolute', top:0, left: 0, right: 0, bottom: 0,

          justifyContent: 'center',
          alignItems: 'center',
          borderRadius : 30,
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={{
          position: 'absolute', top:0, left: 0, right: 0, bottom: 0,
          marginLeft : '-50%',
          height : '200%',
          width : '183%',}}
          // style={StyleSheet.absoluteFillObject}
        />
        <ScannerControl control={this.state.control}/>
        {scanned && (
          <Button
            title={'올바른 QR 코드를 입력해주세요'}
            onPress={() => this.setState({ scanned: false })}
          />
        )}

      </View>
    );
  }
  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true});
    this.setState({ control : "MAIN"});
    // alert(`??? :  ${this.state.control} `);
    let d = new Date();
    console.log('출석 시작 토큰 : ',this.props.token);
    axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/qr/verify?token='+this.props.token,{
            qrNum: data, // QR코드 읽은값
            allowTime: d.getTime(), //  1970년 이후 밀리초 값
            classStartTimeHour : 950,
          })
        .then( response => {
            console.log('성공',response.data);
            this.props.qrComplete(response.data)
        })
        .catch( error => {
            console.log('에러',error);
        });
  };
  
}
function mapStateToProps (state){
  return {
    token: state.jwtToken,
    AppMode: state.AppMode,
  }
}

function mapDispatchToProps(dispatch){
    return {
      loginSuccess : (token) => dispatch({type:'LOGINSUCCESS',jwtToken:token}),
      appMode : (mode) => dispatch({type:'AppMode',mode:mode}),
      qrComplete : (state) => dispatch({type:'QRCOMPLETE',state}),
    }
}
  
export default connect(mapStateToProps,mapDispatchToProps)(BarcodeScannerExample); 