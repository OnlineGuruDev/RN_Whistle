/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'
import store from './store'
import { Provider } from 'react-redux'
import { NativeRouter, BackButton } from 'react-router-native'
import { MenuProvider } from 'react-native-popup-menu'
import { SafeAreaView, StyleSheet, StatusBar, View } from 'react-native'

import WhistleApp from './WhistleApp'
import Flash from './components/Flash'
import firebase from 'react-native-firebase';

class App extends React.Component {
  componentDidMount() {
    console.disableYellowBox = true;
  }

  render() {
    return (
      <Provider store={store}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle='light-content' backgroundColor='#333' />
          <View style={styles.withinSafeArea}>
            <Flash />
            <NativeRouter>
              <MenuProvider backHandler={true}>
                <BackButton />
                <WhistleApp />
              </MenuProvider>
            </NativeRouter>
          </View>
        </SafeAreaView>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#333',
  },
  withinSafeArea: {
    flex: 1,
  },
})

export default App

