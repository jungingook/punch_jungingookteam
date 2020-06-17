// 리엑트 모듈
import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Image, Button, platform } from 'react-native';
import {BlurView} from 'expo'; //블러 이펙트를 사용하기 위해 사용 
// [redux]를 통한 데이터 통신
import {connect} from 'react-redux'
// 컴포넌트 연결
import Header from './header/Header'; // 앱의 메인 화면 구성을 담당하는 컴포넌트
import Contents from './contents/Contents'; // 앱의 메인 화면 구성을 담당하는 컴포넌트
import QRModal from './modal/QRModal'; // 앱의 메인 화면 구성을 담당하는 컴포넌트



const layout = StyleSheet.create({
  Main: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height : 70,
    backgroundColor :"#F6F7F9",
  },
  contents:{
    flex : 1,
    backgroundColor :"#ffffff",
  },
});

const sidebar = StyleSheet.create({
  Background:{
    position: 'absolute', top:70, left: 0, right: 0, bottom: 0,
    flex : 1,
    backgroundColor :"#77777750",
    flexDirection : 'row',
  },
  sidebar:{
    width : 250,
    height : '100%',
    backgroundColor :"#ffffff",
    justifyContent :'flex-start',
    alignItems : 'center'
  },
  back:{
    flex : 1,
    height : '100%',
    backgroundColor :"#ffffff00",
  },
  bottom : {
    height : 80,
    width : '90%',
    margin : 10,
    backgroundColor : '#d9d9d9',
    borderRadius : 5,
    flexDirection : 'row',
    justifyContent :'space-between',
    alignItems : 'center'
  },
  logout : {
    margin : 10,
    padding : 10,
    width : 60, 
    height : 60,
    resizeMode:'contain'
  },
  bottomText : {
    color : '#424242',
    fontSize : 30,
    fontWeight : 'bold',
    height : 60,
    margin : 10,
    padding : 10,
    lineHeight : 30,
  }
});

class MainView extends Component {
  state = {
    sidebar : false
  }
  sidebarOn = () =>  {
    this.setState({
      sidebar : true
    })
  }

  render() {
    // 토큰이 없으면 로그아웃 시키기
    if(!this.props.token){
      console.log('토큰만료로 인한 로그아웃')
      this.props.logout()
    }
    return (
      <View style={layout.Main}>
        <View style={layout.header}> 
          <Header dataBack={this.sidebarOn}/>
        </View>
        <View style={layout.contents}> 
          <ScrollView>
            <Contents/>
          </ScrollView>
          <QRModal/>
        </View>
        {(this.state.sidebar ? 
        <View style={sidebar.Background} >
          <View style={sidebar.sidebar}>
            <TouchableOpacity style={sidebar.bottom} onPress={()=>this.props.logout()} ><Image source={require('../assets/addclass.png')} style={sidebar.logout} /><Text style={sidebar.bottomText} >수업등록</Text></TouchableOpacity>
            <TouchableOpacity style={sidebar.bottom} onPress={()=>this.props.logout()} ><Image source={require('../assets/logout.png')} style={sidebar.logout} /><Text style={sidebar.bottomText} >로그아웃</Text></TouchableOpacity>

            {/* <TouchableOpacity><Text>로그아웃</Text></TouchableOpacity>
            <TouchableOpacity><Text>로그아웃</Text></TouchableOpacity> */}
          </View>
          <TouchableOpacity style={sidebar.back} onPress={()=>this.setState({sidebar : false})}></TouchableOpacity>
        </View>
        :<View></View>)}
      </View>
    );
  }
}


function mapStateToProps (state){
  return {
    token: state.jwtToken,
  }
}
function mapDispatchToProps(dispatch){
  return {
    logout : () => dispatch({type:'LOGOUT'}),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(MainView);