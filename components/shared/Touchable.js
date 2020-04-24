import React from 'react'
import PropTypes from 'prop-types'
import { Platform, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, View } from 'react-native'

const Touchable = ({ children, style, onPress, highlight, noBorderless }) => {
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        // #TODO - research android touch effect, ripple, etc
        style={style}
        // useForeground
        background={noBorderless ? null : TouchableNativeFeedback.SelectableBackgroundBorderless()}
        onPress={onPress}>
        <View style={style}>
          {children}
        </View>
      </TouchableNativeFeedback>
    )
  } else {
    if (highlight) {
      return (
        <TouchableHighlight style={style} onPress={onPress}>
          {children}
        </TouchableHighlight>
      )
    } else {
      return (
        <TouchableOpacity style={style} onPress={onPress}>
          {children}
        </TouchableOpacity>
      )
    }
  }
}

Touchable.propTypes = {
  onPress: PropTypes.func.isRequired,
  highlight: PropTypes.bool
}

export default Touchable
