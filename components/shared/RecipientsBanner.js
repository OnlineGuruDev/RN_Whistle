import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../reference/constants'

const RecipientsBanner = ({recipientCount}) =>
  <View style={styles.headerContainer}>
    <View>
      <Text style={styles.text}>{recipientCount} recipient{recipientCount > 1 && 's'}</Text>
    </View>
  </View>

RecipientsBanner.propTypes = {
  recipientCount: PropTypes.number.isRequired
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: COLORS.NAV_GREEN
  },
  headerContainer: {
    paddingVertical: 10,
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHTER_GRAY
  }
})

export default RecipientsBanner
