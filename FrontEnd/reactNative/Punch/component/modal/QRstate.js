// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableHighlight, Easing, TouchableOpacity, platform, Animated } from 'react-native';
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'


const layout = StyleSheet.create({
    attendanceButton: {
        position: 'absolute', left: '50%', right: 10, bottom: 30,
        borderRadius : 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft : -45,
        height : 90,
        width : 90,
        backgroundColor :"#F6F7F9",
        ...Platform.select({ 
          ios: { 
              shadowColor: '#777777',
              shadowOffset: { width: 2, height: 2, },
              shadowOpacity: 0.6, shadowRadius: 4, 
              },
          android: { elevation: 8, },
          web:{
              
          }
          }), 
      },
    stateReady : {
        height : 90,
        width : 90,
        backgroundColor: 'red'
    },
 
});
const objectStyles = {
    attendBox: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(153, 197, 86)',
        width: 200,
        height: 200,
        borderRadius : 1000,
        opacity: 0,
        borderWidth: 5, borderColor:'rgb(153, 197, 86)',
    },
    tardyBox: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'orange',
        width: 200,
        height: 200,
        borderRadius : 15,
        opacity: 0,
        borderWidth: 5, borderColor:'orange',
      },
    absentBox: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        width: 200,
        height: 200,
        opacity: 0,
        borderWidth: 5, borderColor:'red',
    },
    attendState: {
      fontSize: 80,
      lineHeight : 100,
      fontWeight: 'bold',
      color : '#ffffff',
    },
    attend:{
        color : 'rgb(153, 197, 86)',
    },
    tardy : {
        color : 'orange',
    },
    absent:{
        color : 'red',
    },
  }
class QRstate extends Component {

    state = {
        animation: new Animated.Value(1),

      }
    componentDidMount() {
        Animated.timing(
            this.state.animation,
            {
              toValue: 2,
              duration: 2000,
              easing: Easing.bounce,
              useNativeDriver: true
            }
          ).start();
    }
    

    render() {
        const animationStyles = {
            transform: [
                { 
                    // scale: this.state.animation,
                    // translateY: this.state.animation.interpolate({
                    //     inputRange: [1, 2],
                    //     outputRange: [-200, 0]
                    //   }),
                    translateX: this.state.animation.interpolate({
                        inputRange: [1, 2],
                        outputRange: [200, 0]
                      })
                }
            ],
            opacity : this.state.animation.interpolate({
                inputRange: [1, 1.2, 1.7, 2],
                outputRange: [0, 0, 1, 1]
              })
          };

        let attendBox = [objectStyles.absentBox, animationStyles] 
        let attendText = [objectStyles.attendState]
        if(this.props.attendState=='출석'){
            attendBox = [objectStyles.attendBox, animationStyles] 
            attendText = [objectStyles.attendState]
        }
        if(this.props.attendState=='지각'){
            attendBox = [objectStyles.tardyBox, animationStyles] 
            attendText = [objectStyles.attendState]
        }
        if(this.props.attendState=='결석'){
            attendBox = [objectStyles.absentBox, animationStyles] 
            attendText = [objectStyles.attendState]
        }

      return (
        <TouchableOpacity> 
            <Animated.View style={attendBox}>
                <Text style={attendText}>
                {this.props.attendState? this.props.attendState: '인식실패'}
                </Text>
            </Animated.View>
        </TouchableOpacity>
      );
    }
  }
  
  function mapStateToProps (state){
    return {
      AppMode: state.AppMode,
      attendState : state.attendState,
    }
  }

  function mapDispatchToProps(dispatch){
      return {
        qrButtonPush : () => dispatch({type:'QRSCAN'}),
        appMode : (mode) => dispatch({type:'AppMode',mode:mode}),
      }
  }

  export default connect(mapStateToProps,mapDispatchToProps)(QRstate); 