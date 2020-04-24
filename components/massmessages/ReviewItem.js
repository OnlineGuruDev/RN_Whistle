import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'

import { COLORS } from '../../reference/constants'
import { formatDateWithTime } from '../../reference/functions'

import Media from '../conversation/Media'
import ReviewItemStatus from './ReviewItemStatus'
import { ContactAvatar } from '../shared/AvatarBubbles'

const ReviewItem = ({ pI, resendMessage, resendiMessage }) => {
  const pickColor = () => {
    switch (pI.kind) {
      case 'message':
        return { backgroundColor: COLORS.LIGHT_GREEN }
      case 'twitter_dm':
        return { backgroundColor: COLORS.TWITTER_LIGHT }
      case 'imessage':
        return { backgroundColor: COLORS.IMESSAGE_LIGHT }
      case null:
        return { backgroundColor: COLORS.LIGHT_GREEN }
      default:
        return { backgroundColor: COLORS.GRAY }
    }
  }
  const RenderItem = (pI) => {
    if(pI.kind === 'imessage')
      return (
        <View>
         <Media attachments={pI.attach_list} />
        { !!pI.body && <Text selectable style={styles.outboundFont}>{pI.body}</Text> }       
      </View>
      )
    else
      return (
        <View>
          { !!pI.body && <Text selectable style={styles.outboundFont}>{pI.body}</Text> }
          <Media attachments={pI.attach_list} />
        </View>
      )
  }
  return (
    <View style={styles.reviewItemContainer}>
      <View style={styles.recipientRow}>
        <ContactAvatar contact={pI.contact} />
        <Text style={styles.recipientTitle} selectable>{pI.contact.title}</Text>
      </View>
      <View style={styles.bodyRow}>
        <View style={[styles.outboundTextBox, pickColor()]}>
          {RenderItem(pI)}        
          <ReviewItemStatus item={pI} resendMessage={resendMessage} resendiMessage={resendiMessage} />
        </View>
        <Text selectable style={styles.subtitleFont}>
          <Text selectable style={[styles.subtitleFont, styles.schedule]}>{`Sent on: `}</Text>
          { formatDateWithTime(pI.schedule_at) }
        </Text>
      </View>
    </View>
  )
}

ReviewItem.propTypes = {
  pI: PropTypes.object.isRequired,
  resendMessage: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  reviewItemContainer: {
    flex: 1,
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 12,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#e8ece7',
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientTitle: {
    marginLeft: 5,
  },
  bodyRow: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  outboundTextBox: {
    marginLeft: 30,
    marginTop: 10,
    borderRadius: 15,
    borderBottomRightRadius: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    alignItems: 'flex-end',
  },
  outboundFont: {
    fontSize: 16,
    color: 'white',
    marginBottom: 3,
  },
  subtitleFont: {
    fontSize: 13,
  },
})

export default ReviewItem
