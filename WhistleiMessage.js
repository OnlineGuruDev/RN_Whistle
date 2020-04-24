
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  NativeEventEmitter,
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import store from './store'
import { Provider } from 'react-redux'
import { NativeRouter, BackButton } from 'react-router-native'
import { MenuProvider } from 'react-native-popup-menu'

import WhistleStorage from './WhistleStorage'
import Flash from './components/Flash'
export default class WhistleiMessage extends Component {
    render() {
        return (
            <Provider store={store}>
            <SafeAreaView style={styles.safeArea}>
              {/* <StatusBar barStyle='light-content' backgroundColor='#333' /> */}
              <View style={styles.withinSafeArea}>
                <Flash />
                <NativeRouter>
                  <MenuProvider backHandler={true}>
                    <BackButton />
                    <WhistleStorage type={this.props.type} handleSFPress={this.props.handleSFPress} setViewIndex={this.props.setViewIndex} />
                  </MenuProvider>
                </NativeRouter>
              </View>
            </SafeAreaView>
          </Provider>
        )
    }
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#333',
    },
    withinSafeArea: {
      flex: 1,
    },
  })
  