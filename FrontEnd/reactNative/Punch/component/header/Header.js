// 리엑트 모듈
import React, { Component } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Button } from 'react-native';

const layout = StyleSheet.create({
  headerBar: {
    flexDirection : "row",
    justifyContent :"space-between",
    flex : 1,
  },
  menuButton : {
    width: '10%',
    margin : '4%',
    borderRadius : 5,
    backgroundColor : "#ddd",
    textAlign : "center",
    flexDirection : "column",
    justifyContent : "center"
  },
  menuButtonText : {
    fontSize : 20,
    lineHeight :20,
  },
  searchButton : {
    width: '20%',
    margin : '4%',
    borderRadius : 30,
    backgroundColor : "#ccc",
    textAlign : "center",
    flexDirection : "column",
    justifyContent : "center"
  },
  searchButtonText :{
    
  }
});

class Header extends Component {
    render() {
      return (
        <View style={layout.headerBar}>
          <View style={layout.menuButton}>
            <Text style={layout.searchButtonText}>◀</Text>
          </View>
          <View style={layout.searchButton}>
            <Text style={layout.searchButtonText}>검색</Text>
          </View>
        </View>
      );
    }
  }
  
  export default Header;