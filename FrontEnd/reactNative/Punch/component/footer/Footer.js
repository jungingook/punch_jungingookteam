// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';


class Footer extends Component {
    render() {
      return (
          <View>
              <Button
                title={'출첵'}
                onPress={() => store.dispatch({ type: "panelMode",AppMode : "QRscan"})}
          />
          </View>
      );
    }
  }
  
  export default Footer;