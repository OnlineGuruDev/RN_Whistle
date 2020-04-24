import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'

const FillerMessageScreen = ({ message }) =>
  <View style={styles.nonContentContainer}>
    <Text style={styles.noCoachText}>{message}</Text>
  </View>

FillerMessageScreen.propTypes = {
  message: PropTypes.string
}

const styles = StyleSheet.create({
  nonContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noCoachText: {
    color: 'gray'
  }
})

export default FillerMessageScreen
