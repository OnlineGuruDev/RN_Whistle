import React from 'react'
import PropTypes from 'prop-types'
//import Constants from 'expo-constants';

import { View, KeyboardAvoidingView, Platform, StatusBar } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';

const KeyboardView = ({offset = 0, includeStatusOffset = true, children, style}) => {
  // NOTES FOR FUTURE SUCKERS:
  // - I couldn't figure out a way to get IOS to move text inputs above the Keyboard
  //   but for some reason it's standard in android, so here's the "solution"
  // - This will not function inside of a ScrollView
  // - KAV will not respect device status bar in measurements. So this prop should usually be passed as true.
  // - KAV only calculates direct siblings and parents in measurements. components
  //    heights (usually) from separate rendering branches will have to be calculated in the offset prop
  if (Platform.OS === 'ios') {
    //const statusBar = includeStatusOffset ? Constants.statusBarHeight : 0
    const statusBar = includeStatusOffset ? getStatusBarHeight():0//StatusBar.currentHeight : 0
    return (
      <KeyboardAvoidingView
        behavior='padding'
        style={style}
        keyboardVerticalOffset={offset + statusBar}>
        { children }
      </KeyboardAvoidingView>
    )
  } else {
    return (
      <View style={style}>
        { children }
      </View>
    )
  }
}

KeyboardView.propTypes = {
  includeStatusOffset: PropTypes.bool,
  offset: PropTypes.number,
}

export default KeyboardView