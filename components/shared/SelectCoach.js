import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'

const SelectCoach = ({ pageName }) =>
  <View style={styles.nonContentContainer}>
    <Text style={styles.noCoachText}>{`Select a Coach to see ${pageName}`}</Text>
  </View>

SelectCoach.propTypes = {
  pageName: PropTypes.string.isRequired
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

export default SelectCoach
