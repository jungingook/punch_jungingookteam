import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import { BarCodeScanner } from 'expo-barcode-scanner';

// [ajax] axios 연결
import axios from 'axios';

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
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
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>카메라에 연결할수 없습니다.</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned && (
          <Button
            title={'다시 스켄하기'}
            onPress={() => this.setState({ scanned: false })}
          />
        )}
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    let d = new Date();
    axios.post('http://ec2-54-180-94-182.ap-northeast-2.compute.amazonaws.com:3000/mobile/qr/verify',{
            qrNum: data, // QR코드 읽은값
            allowTime: d.getTime(), //  1970년 이후 밀리초 값
            studentId: 1, // 학생 id값
          })
        .then( response => {
            console.log(response.data);
            alert(`인증성공 :  ${response.data} `);
        })
        .catch( error => {
            console.log(error);
            alert(`인증성공 :  ${error} `);
        });
  };
  
}
