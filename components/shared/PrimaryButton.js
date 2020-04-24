import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native'
import { COLORS } from '../../reference/constants'
import Touchable from './Touchable'

export default PrimaryButton = ({ action, text, spinner = false, buttonStyle, textStyle, disabled }) => {
  if (spinner) {
    return (
      <Touchable onPress={() => null}>
        <View style={[styles.button, buttonStyle]}>
          <ActivityIndicator size="small" color='white' />
        </View>
      </Touchable>
    )
  }
  if (disabled) {
    return (
      <View style={[styles.button, buttonStyle, styles.disabled]}>
        <Text style={textStyle}>{text}</Text>
      </View>
    )
  }

  return (
    <Touchable onPress={action}>
      <View style={[styles.button, buttonStyle]}>
        <Text style={textStyle}>{text}</Text>
      </View>
    </Touchable>
  )
}



PrimaryButton.propTypes = {
  action: PropTypes.func,
  spinner: PropTypes.bool,
  text: PropTypes.string
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    backgroundColor: COLORS.LIGHTER_GREEN,
    alignItems: 'center',
    width: 200,
    paddingVertical: 10,
    justifyContent: 'center',
    marginVertical: 5,
    borderRadius: 5
  },
  disabled: {
    backgroundColor: COLORS.LIGHTEST_GRAY,
  }
})
