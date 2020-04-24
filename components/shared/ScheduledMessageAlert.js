import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
import { COLORS } from '../../reference/constants'
import moment from 'moment'

const ScheduledMessageAlert = ({ isScheduled, datetime }) => isScheduled
  ? <View style={styles.scheduledContainer}>
    <Text>{'Scheduled To Send: '}</Text>
    <Text style={styles.scheduledText}>{moment(datetime).format('ddd, M/D/YY, h:mm a')}</Text>
  </View>
  : null

ScheduledMessageAlert.propTypes = {
  datetime: PropTypes.object.isRequired,
  isScheduled: PropTypes.bool
}

const styles = StyleSheet.create({
  scheduledContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0
  },
  scheduledText: {
    color: COLORS.WARNING_ORANGE
  }
})

export default ScheduledMessageAlert
