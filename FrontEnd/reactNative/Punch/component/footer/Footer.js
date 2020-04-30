// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'




class Footer extends Component {
    render() {
      return (
          <View>
              <Text>{this.props.AppMode}</Text>
              <Button
                title={'출첵'}
                onPress={()=> this.props.qrButtonPush()}
          />
          </View>
      );
    }
  }
  
  function mapStateToProps (state){
    return {
      AppMode: state.AppMode
    }
  }

  function mapDispatchToProps(dispatch){
      return {
        qrButtonPush : () => dispatch({type:'QRSCAN'}),
      }
  }

  export default connect(mapStateToProps,mapDispatchToProps)(Footer); 