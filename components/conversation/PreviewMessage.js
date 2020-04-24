import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
//import { Ionicons } from '@expo/vector-icons'

import moment from 'moment'

import { isEmpty } from '../../reference/functions'
import { COLORS } from '../../reference/constants'

import Touchable from '../shared/Touchable'
import TextMessage from './TextMessage'
import TwitterDM from './TwitterDM'

const PreviewMessage = ({loading, preview, media, messageType}) => {

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator animating size='small' color={COLORS.LIGHT_GREEN} /></View>

  const pickMessage = () => {
    switch(messageType) {
      case "message":
        return <TextMessage
                 item={{...preview, attach_list: [...(preview.pics || [])], created_at: scheduled_time}}
                 localAttachment={media}
                 inbound={false}
               />
      case "twitter_dm":
        return <TwitterDM
                 item={{...preview, attach_list: [...(preview.pics || [])], created_at: scheduled_time}}
                 localAttachment={media}
                 inbound={false}
               />
      default:
        return <TextMessage
                 item={{...preview, attach_list: [...(preview.pics || [])], created_at: scheduled_time}}
                 localAttachment={media}
                 inbound={false}
               />
    }
  }

  const scheduled_time = preview.schedule_at ? moment(preview.schedule_at) : moment()
  return (
    <View style={[styles.previewItemContainer, !preview.valid && styles.invalid]}>
      {isEmpty(preview)
        ? <Text>No Content. Reload Page.</Text>
        : pickMessage() }
    </View>
  )
}

const styles = StyleSheet.create({
  previewItemContainer: {
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 5,
    backgroundColor: COLORS.LIGHTEST_GREEN,
    borderRadius: 5,
  },
  invalid: {
    backgroundColor: COLORS.LIGHT_ALERT_RED
  },
  loadingContainer: {
    marginVertical: 10,
  }
})

export default PreviewMessage
