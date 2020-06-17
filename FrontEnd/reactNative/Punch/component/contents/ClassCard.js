// 리엑트 모듈
import React, { Component } from 'react';
import { Platform, TouchableOpacity, View, Text, StyleSheet, Button, BackHandler } from 'react-native';
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'

const classCard = StyleSheet.create({
    Layout : {
        width : "90%",
        marginLeft : '5%' ,
        marginRight : '5%' ,
        height : 200,
        flexDirection : "column",
        borderRadius : 10,
        marginTop : 10,
        marginBottom : 10,
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
    upper : {
        flex : 3,
        // backgroundColor : "#00B0F0",
        borderTopLeftRadius : 10,
        borderTopRightRadius : 10,
        justifyContent : "space-between",
        paddingLeft : '5%',
        paddingRight : '5%',
    },
    lower : {
        flex : 2,
        // backgroundColor : "#009FF0",
        borderBottomLeftRadius : 10,
        borderBottomRightRadius : 10,
        flexDirection : "column",
        justifyContent : "center"
    },
  });

  const cardDesign = StyleSheet.create({
    calssinfo : {
        paddingTop : 10,

    },
    textColorWhite : {
        color : '#ffffff',
        fontSize : 20,
        fontWeight : 'bold',
    },
    calssName : {
        width : '90%',
        paddingLeft : '5%',
        paddingRight : '5%',
        color: "#fff",
        fontSize : 30,
        fontWeight : 'bold',
        overflow : 'hidden',
    },
  });

class ClassCard extends Component {

    date = (day,startTime,endTime) => {
        let weekday = new Array();
        weekday[0]="일요일"; weekday[1]="월요일"; weekday[2]="화요일"; weekday[3]="수요일"; weekday[4]="목요일"; weekday[5]="금요일"; weekday[6]="토요일";
        return weekday[day] +" "+ Math.floor(startTime/60) + " : " + (startTime%60<10? "0"  +startTime%60 : startTime%60 )+ " ~ " + Math.floor((startTime+endTime)/60) + " : " + ((startTime+endTime)%60<10? "0"  +(startTime+endTime)%60 : (startTime+endTime)%60 )
    }

    selectCard = () => {
        this.props.selectCard(this.props.info)
    }

    render() {
        const {
            day, name, color// , professor, code, id // 사용하지 않는 상수
            } = this.props.info;
        let cardColor = this.props.cardColor["default"]
        let bgColor={backgroundColor:cardColor[0]}
        let titleColor ={backgroundColor:cardColor[1]}
        let timeID = 0 
        let classTimeText = this.props.info.classTime.map(
            info => (<Text style={cardDesign.textColorWhite} key={timeID++}>{this.date(info.day,info.startTime,info.endTime)}</Text>)   
        );
        try {
            cardColor = this.props.cardColor[color]
            bgColor={backgroundColor:cardColor[0]}
            titleColor ={backgroundColor:cardColor[1]}
          } catch (e) {
          }
      return (
        <TouchableOpacity style={classCard.Layout} onPress={()=>this.selectCard()}>
            <View style={[classCard.upper,bgColor]}>
                <View style={cardDesign.calssTime}><Text style={cardDesign.textColorWhite}>{this.props.info.professor}</Text></View>
                <View style={cardDesign.calssTime}>{classTimeText}</View>
            </View>
            <View style={[classCard.lower,titleColor]}>
                <Text style={cardDesign.calssName}>{this.props.info.name}</Text>
            </View>
        </TouchableOpacity>
      );
    }
  }
  const mapStateToProps = (state) => ({
    cardColor : state.cardColor
  })
  function mapDispatchToProps(dispatch){
      return {
        appMode : (mode) => dispatch({type:'AppMode',mode:mode}),
        selectCard : (classObject) => dispatch({type:'SelectCard',card:classObject}),
      }
  }
export default connect(mapStateToProps,mapDispatchToProps)(ClassCard);
