// 리엑트 모듈
import React, { Component } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Image, Button } from 'react-native';

const layout = StyleSheet.create({
  headerBar: {
    flexDirection : "row",
    justifyContent :"space-between",
    marginLeft : '5%' ,
    marginRight : '5%' ,
    flex : 1,
    alignItems: 'center',
  },
 
  menuButton : {
    width : 40, 
    height : 40,
    resizeMode:'contain' 
  },
  headerMid : {
    flex : 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo : {
    width : 50, 
    height : 60,
    resizeMode:'contain'
  },
  searchButton : {
    width : 40, 
    height : 40,
    resizeMode:'contain'
  },

});

class Header extends Component {
  sidebarOn = () =>  {
    this.props.dataBack();
  }


    render() {
      return (
        <View style={layout.headerBar}>
          <TouchableOpacity onPress={()=>this.sidebarOn()}>
            {/* 메뉴버튼 */}
            <Image source={require('../../assets/menu.png')} style={layout.menuButton} /> 
            {/* onPress={} */}
          </TouchableOpacity>
          <View style={layout.headerMid}>  
            <Image source={require('../../assets/logoS.png')} style={layout.headerLogo}/>
          </View>      
          <TouchableOpacity>
            {/* 검색버튼 */}
            <Image source={require('../../assets/search.png')} style={layout.searchButton}/>
          </TouchableOpacity>
        </View>
      );
    }
  }
  
  export default Header;