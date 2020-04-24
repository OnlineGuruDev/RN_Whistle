import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-native'
import { StyleSheet, View, Text } from 'react-native'
//import { Ionicons, FontAwesome } from '@expo/vector-icons'
import FIcon from 'react-native-vector-icons/FontAwesome'; 
import Icon from 'react-native-vector-icons/Ionicons'; 

import { formatDateWithTime } from '../../reference/functions'

import Touchable from '../shared/Touchable'
import { ContactAvatar } from '../shared/AvatarBubbles'
import Media from '../conversation/Media'
import { COLORS } from '../../reference/constants'

const PreviewEditItem = ({pI, removeRecipient, history, attachment, localAttachment}) => {

  const goToProfile = () => {
    history.push(`/profile/${pI.to.id}`)
  }

  const pickColor = () => {
    switch (pI.kind) {
      case 'message':
        return { backgroundColor: COLORS.LIGHT_GREEN }
      case 'twitter_dm':
        return { backgroundColor: COLORS.TWITTER_LIGHT }
      case 'imessage':
        return { backgroundColor: COLORS.IMESSAGE_LIGHT }
      default:
        return { backgroundColor: COLORS.GRAY }
    }
  }

  const getMessagePreviewStatus = previewItem => {
    if (previewItem.to.freezed) {
      return (
        <View style={styles.messageStatusContainer}>
          <FIcon style={{ color: COLORS.BLUE }} name="snowflake-o" size={16} />
          <Text style={{ color: COLORS.BLUE }}>Frozen</Text>
        </View>
      )
    }
    if (!previewItem.valid) {
      return (
        <View style={styles.messageStatusContainer}>
          <FIcon style={{ color: COLORS.ALERT_RED }} name="times" size={16} />
          <Text style={{ color: COLORS.ALERT_RED }}>Invalid</Text>
        </View>
      )
    }
    return (
      <View style={styles.messageStatusContainer}>
        <FIcon style={{ color: COLORS.LIGHT_GREEN }} name="check" size={16} />
        <Text style={{ color: COLORS.LIGHT_GREEN }}>Valid</Text>
      </View>
    )
  }

  return (
    <View>
      <View style={[styles.previewItemContainer, (!pI.valid && styles.invalid), (pI.to.freezed && styles.frozen)]}>
        <View style={styles.recipientRow}>
          <Touchable onPress={goToProfile}>
            <View>
              <ContactAvatar contact={pI.to} />
            </View>
          </Touchable>
          <Text style={styles.recipientTitle} selectable>{pI.to.title}</Text>
        </View>
        <View style={styles.bodyRow}>
          <View style={[styles.outboundTextBox, pickColor()]}>
            { !!pI.body && <Text selectable style={styles.outboundFont}>{pI.body}</Text> }
            {/* { !!attachment && <Media attachments={[attachment]} /> }
            { !!localAttachment && <Media attachments={[localAttachment]} /> } */}
            {/* { !!pI.pics && !!pI.pics.length && <Media attachments={pI.pics}/> } */}
            <Media attachments={[
              ...pI.pics,
              ...(localAttachment ? [localAttachment] : []),
              ...(attachment ? [attachment] : []),
            ]}/>
          </View>
          <View style={styles.bottomRow}>
            {pI.schedule_at && (
              <Text selectable style={styles.subtitleFont}>
                <Text selectable style={[styles.subtitleFont, styles.schedule]}>{`Scheduled for: `}</Text>
                { formatDateWithTime(pI.schedule_at) }
              </Text>
            )}
            {getMessagePreviewStatus(pI)}
          </View>
        </View>
        <Touchable style={styles.removeRecipientIcon} onPress={() => removeRecipient(pI.to.id)}>
          <Icon name='md-close' size={22} style={{ height: 22 }} color={COLORS.ALERT_RED} />
        </Touchable>
      </View>
    </View>
  )
}

PreviewEditItem.propTypes = {
  attachment: PropTypes.string,
  history: PropTypes.object.isRequired,
  pI: PropTypes.object.isRequired,
  removeRecipient: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  previewItemContainer: {
    flex: 1,
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 12,
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: '#caeab5',
    borderRadius: 5,
    position: 'relative',
  },
  invalid: {
    backgroundColor: COLORS.LIGHT_ALERT_RED,
  },
  frozen: {
    backgroundColor: COLORS.LIGHT_BLUE,
  },
  bottomRow: {
  },
  messageStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusText: {
    color: COLORS.WHITE,
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientTitle: {
    marginLeft: 5,
  },
  removeRecipientIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: -8,
    right: -8,
    backgroundColor: COLORS.WHITE,
    borderRadius: 30,
    height: 30,
    width: 30,
    textAlign: 'center',
  },
  bodyRowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  bodyRow: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  outboundTextBox: {
    backgroundColor: '#73bd32',
    marginLeft: 30,
    marginTop: 10,
    borderRadius: 15,
    borderBottomRightRadius: 0,
    padding: 10
  },
  outboundFont: {
    fontSize: 16,
    color: '#fff'
  },
  subtitleFont: {
    fontSize: 13
  },
  schedule: {
    color: '#777'
  }
})

export default withRouter(PreviewEditItem)
