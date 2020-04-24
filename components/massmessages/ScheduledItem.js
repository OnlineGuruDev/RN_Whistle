import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
//import { MaterialCommunityIcons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

import { formatDateWithTime } from '../../reference/functions'

import Touchable from '../shared/Touchable'
import ScheduledSentAvatar from './ScheduledSentAvatar'

const ScheduledItem = ({sI, removeMessage, viewPreview, currentStaff}) => {
  return (
    <Touchable onPress={() => viewPreview(sI)}>
      <View style={[styles.scheduledItemContainer, !sI.is_valid && styles.invalidAreas]}>
        <ScheduledSentAvatar num={sI.contacts_count} />
        <View style={styles.body}>
          <Text numberOfLines={1} style={styles.bodyText}>{sI.media ? "[media] " : null}{sI.body}</Text>
          <Text style={styles.subtitleFont}>Scheduled for: <Text style={styles.schedule_at}>{ formatDateWithTime(sI.schedule_at) }</Text></Text>
        </View>
        <Touchable onPress={() => removeMessage(sI.id, currentStaff.id)}>
          <View style={styles.cancelContainer}>
            <Icon style={{color: 'red'}} name='cancel' size={28} />
          </View>
        </Touchable>
      </View>
    </Touchable>
  )
}

ScheduledItem.propTypes = {
  sI: PropTypes.object.isRequired,
  removeMessage: PropTypes.func.isRequired,
  viewPreview: PropTypes.func.isRequired,
  currentStaff: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  scheduledItemContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  body: {
    flex: 1,
    paddingRight: 5,
  },
  bodyText: {
    fontSize: 14,
    color: '#333',
  },
  subtitleFont: {
    fontSize: 12,
    color: '#777',
  },
  invalidAreas: {
    backgroundColor: 'rgba(228, 71, 60, 0.44)',
  },
  cancelCircle: {
    height: 25,
    width: 50,
    borderRadius: 5,
    backgroundColor: '#d9534f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelCircleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelContainer: {
    flex: 0,
    marginLeft: 'auto',
  },
  schedule_at: {
    color: '#333',
  },
})

export default ScheduledItem
