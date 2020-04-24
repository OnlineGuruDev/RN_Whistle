/**
 * Sample React Native Share Extension
 * @flow
 */

 import React, { Component } from 'react';
 import {
   StyleSheet,
 } from 'react-native';
 import store from './store'
 import { Provider } from 'react-redux'
 import { NativeRouter, BackButton } from 'react-router-native'
 import { MenuProvider } from 'react-native-popup-menu'
 import MyShareExStorage from './MyShareExStorage'

 export default class MyShareEx extends Component {
   constructor(props, context) {
     super(props, context)
     this.state = {
       
     }
   }
 
   async componentDidMount() {
    console.disableYellowBox = true;
   }
 
   render() {
     console.log('123')
     return (
      <Provider store={store}>
        <NativeRouter>
          <MenuProvider backHandler={true}>
            <BackButton />
            <MyShareExStorage />
          </MenuProvider>
        </NativeRouter>
       </Provider>
     );
   }
 }
 

