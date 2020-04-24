import React from 'react'
import PropTypes from 'prop-types'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'

const Loader = ({ text = 'Loading...' }) =>
  <View style={styles.nonContentContainer}>
    <ActivityIndicator color='#73bd32' animating size='large' />
    {/* bug in react-native throws error when toggling elements quickly ---race condition. Supposedly this won't happen on physical device. */}
    <Text style={styles.loaderText}>{text}</Text>
  </View>

Loader.propTypes = {
  text: PropTypes.string
}

const styles = StyleSheet.create({
  nonContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loaderText: {
    color: '#555'
  }
})

export default Loader
