import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Header extends Component {
    render() {
        return (
            <view>
              <Text>
                  이곳은 헤더입니다. 
                  테스트헤더
              </Text>
              <Text>
                  이곳은 메인입니다. 
                  메인
              </Text>
            </view>
        )
    }
}
export default Header;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});