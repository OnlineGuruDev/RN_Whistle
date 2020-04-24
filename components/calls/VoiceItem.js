import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { View, Text, StyleSheet } from 'react-native'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { COLORS } from '../../reference/constants'

import Touchable from '../shared/Touchable'
import { ContactAvatar } from '../shared/AvatarBubbles'

const VoicemailPresent = ({listenToVoicemail}) => {
  return (
    <Touchable onPress={listenToVoicemail}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Icon style={styles.voiceIcon} name='md-recording' />
        {/* <Ionicons style={styles.voiceIcon} name='md-recording' /> */}
      </View>
    </Touchable>
  )
}

class VoiceItem extends PureComponent {
  render () {
    const { call, listenToVoicemail, selectProfile, selectCall, callTags } = this.props
    const contact = call.contact
    const fontStyle = call.is_read ? styles.titleFont : styles.fontUnread
    const callSuccess = call.is_read ? styles.success : styles.missed
    return (
      <Touchable onPress={() => selectProfile(contact)}>
        <View style={styles.contactItem}>
          <ContactAvatar contact={contact}/>
          <View style={styles.body}>
            <View style={styles.leftContainer}>
              <Text numberOfLines={1} style={fontStyle}>{contact.title}</Text>
              <View style={styles.subtitle}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <Ionicons style={styles.phoneIcon} name='ios-call' /> */}
                  <Icon style={styles.phoneIcon} name='ios-call' />
                  { call.direction === 'outbound'
                    ? <Icon style={callSuccess} name='md-arrow-round-forward' />//<Ionicons style={callSuccess} name='md-arrow-round-forward' />
                    : <Icon style={callSuccess} name='md-arrow-round-back' />//<Ionicons style={callSuccess} name='md-arrow-round-back' />
                  }
                </View>
                <Text numberOfLines={1} style={styles.callTag}>{call.call_tag && callTags[call.call_tag]}</Text>
              </View>
            </View>
            <View style={styles.rightContainer}>
              { call.voicemail_url && <VoicemailPresent call={call} listenToVoicemail={() => listenToVoicemail(call)} /> }
              <Touchable style={{flex: 1, alignItems: 'center'}} onPress={() => selectCall(call)}>
                <Icon style={call.call_tag ? styles.tagged : styles.tagIcon} name='md-pricetag' />
                {/* <Ionicons style={call.call_tag ? styles.tagged : styles.tagIcon} name='md-pricetag' /> */}                
              </Touchable>
            </View>
            <View style={styles.timeBox}>
              <Text numberOfLines={1} style={styles.timeFont}>{moment(call.created_at).format('h:mm A')}</Text>
            </View>
          </View>
        </View>
      </Touchable>
    )
  }
}

VoiceItem.propTypes = {
  call: PropTypes.object.isRequired,
  callTags: PropTypes.object.isRequired,
  listenToVoicemail: PropTypes.func.isRequired,
  selectCall: PropTypes.func.isRequired,
  selectProfile: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  timeBox: {
    width: 75,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  contactItem: {
    flex: 1,
    height: 55,
    alignItems: 'center',
    margin: 5,
    flexDirection: 'row'
  },
  body: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1
  },
  leftContainer: {
    flex: 1,
    paddingHorizontal: 5
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 50,
    alignSelf: 'center'
  },
  fontUnread: {
    fontSize: 18,
    color: '#d22e29',
    fontWeight: 'bold'
  },
  tagIcon: {
    fontSize: 30,
    opacity: 0.5,
    color: '#555',
    marginLeft: 0
  },
  titleFont: {
    fontSize: 18,
    color: '#555'
  },
  subtitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timeFont: {
    fontSize: 16,
    color: '#777',
    alignSelf: 'center'
  },
  callTag: {
    fontSize: 14,
    color: COLORS.LIGHTER_GREEN,
    marginLeft: 5
  },
  phoneIcon: {
    fontSize: 20
  },
  voiceIcon: {
    fontSize: 30,
    color: '#333'
  },
  tagged: {
    fontSize: 30,
    color: '#98c950',
    marginLeft: 0
  },
  success: {
    fontSize: 20,
    color: 'green',
    alignSelf: 'center'
  },
  missed: {
    fontSize: 20,
    color: 'red',
    alignSelf: 'center'
  }
})

export default VoiceItem
