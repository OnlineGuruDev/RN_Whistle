import React from 'react'
import { connect } from 'react-redux'
//import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'; 

import { Text, StyleSheet, View, Alert} from 'react-native'

import { resend } from '../../actions/activities'

import StatusIcon from './StatusIcon'
import Touchable from '../shared/Touchable'

const MessageStatus = ({ item, currentStaff, dispatch }) => {
  if (item.direction === "inbound") return null

  const tryResend = () => {
    Alert.alert(
      'Resend?',
      "Confirm.",
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Confirm', onPress: () => {
          dispatch({type: "UPDATE_CONVERSATION_ITEM", data: {id: item.id, status: "sending", error_message: "", status_msg: ""}})
          dispatch(resend(item.id, currentStaff.id))
        }},
      ]
    )
  }


  const error = item.status === "failed" || item.status === "undelivered"

  return (
    <View style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <View style={[styles.outboundSub, error && styles.error]}>
        <StatusIcon status={item.status} />
        <Text style={[styles.subtitle, error && {color: '#ffeb3b'}]}>
          {` ${item.status}${item.status_msg ? `: ${item.status_msg}` : ''}`}
        </Text>
      </View>
      { error
      ? <View style={styles.outboundSub}>
          <Touchable style={styles.outboundSub} onPress={tryResend}>
            <Icon style={styles.transWhite} name='refresh' size={16} />
            <Text style={styles.transWhite}> resend</Text>
          </Touchable>
        </View> 
      : null }
    </View>
  )
}

const styles = StyleSheet.create({
  error: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginLeft: 10
  },
  outboundSub: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)'
  },
  transWhite: {
    color: 'rgba(255, 255, 255, 0.7)'
  }
})

const mapStateToProps = state => {
  return {
    currentStaff: state.currentStaff
  }
}

export default connect(mapStateToProps)(MessageStatus)
