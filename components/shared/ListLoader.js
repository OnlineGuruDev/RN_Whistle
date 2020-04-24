import React from 'react'
import PropTypes from 'prop-types'
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native'

const ListLoader = ({ top }) =>
  <View style={[styles.listLoaderContainer, top ? styles.top : styles.bottom]}>
    <ActivityIndicator color='#73bd32' animating size='small' />
  </View>

ListLoader.propTypes = {
  top: PropTypes.bool
}

const styles = StyleSheet.create({
  listLoaderContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 5,
    zIndex: 5
  },
  top: {
    top: 0
  },
  bottom: {
    bottom: 0
  }
})

export default ListLoader
