import React from 'react'
//import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'; 

import { Text, StyleSheet, View, Alert} from 'react-native'

import StatusIcon from '../conversation/StatusIcon'
import Touchable from '../shared/Touchable'

const ReviewItemStatus = ({ item, resendMessage, resendiMessage }) => {
  const tryResend = () => {
    Alert.alert(
      'Resend?',
      'Confirm.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm',
          onPress: () => {
            // if(item.kind === 'twitter_dm')
            //   resendiMessage(item)
            // else
              resendMessage(item.id)
          },
        },
      ]
    )
  }

  const inbound = item.direction === 'inbound'

  const error = item.status === 'failed' || item.status === 'undelivered'

  if (inbound) return null
  return (
    <View style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <View style={[styles.outboundSub, { marginLeft: 15 }]}>
        { !inbound && <StatusIcon status={item.status} /> }
        <Text style={[styles.subtitle, error && { color: '#ffeb3b' }]}>
          {` ${item.status}${item.status_msg ? `: ${item.status_msg}` : ''}`}
        </Text>
      </View>
      {error
        ? (
          <View style={styles.outboundSub}>
            <Touchable style={styles.outboundSub} onPress={tryResend}>
              <Icon style={styles.transWhite} name='refresh' size={16} />
              <Text style={styles.transWhite}> resend</Text>
            </Touchable>
          </View>
        )
        : null }
    </View>
  )
}

const styles = StyleSheet.create({
  outboundSub: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  transWhite: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
})

export default ReviewItemStatus
