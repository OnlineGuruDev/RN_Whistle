import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
//import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'; 

import { View, Text, StyleSheet } from 'react-native'
import Hyperlink from 'react-native-hyperlink'
import { displayDate } from '../../reference/functions'
import InboundAvatar from './InboundAvatar'
import ImageModal from '../shared/ImageModal'

import Media from './Media'
import MessageStatus from './MessageStatus'

class TextMessage extends PureComponent {
  render() {
    const { inbound, item, localAttachment, contact } = this.props
    return (
      <View style={[styles.container, inbound ? styles.inbound : styles.outbound]}>
        <InboundAvatar contact={contact} inbound={inbound} />
        <View style={styles.messageContainer}>
          <View style={inbound ? styles.inboundBody : styles.outboundBody}>
            <View style={inbound ? styles.inboundTextBox : styles.outboundTextBox}>
              { !!item.body &&
                <Hyperlink linkDefault linkStyle={styles.link}>
                  <Text selectable style={inbound ? styles.inboundFont : styles.outboundFont}>{item.body}</Text>
                </Hyperlink>
              }
              <Media attachments={item.attach_list}/>
              {/* don't show the local attachment if there are whistle_pics or storage_files (attach_list) because those will take priority */}
              { !item.attach_list.length && !!localAttachment && !!localAttachment.length &&
                <ImageModal source={{uri: localAttachment}} />
              }
              { !!item.status && <MessageStatus item={item} /> }
            </View>
          </View>
          <View style={inbound ? styles.inboundSubtitle : styles.outboundSubtitle}>
            <Icon style={[styles.subtitle, styles.subtitleIcon]} name="mobile" size={18} />
            <Text style={styles.subtitle}>{ displayDate(item.created_at) }</Text>
          </View>
        </View>
      </View>
    )
  }
}

TextMessage.propTypes = {
  item: PropTypes.object.isRequired,
  inbound: PropTypes.bool.isRequired,
  localAttachment: PropTypes.string
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 8,
    marginBottom: 5,
  },
  inbound: {
    justifyContent: 'flex-start',
    paddingRight: 30,
  },
  outbound: {
    paddingLeft: 30,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    flex: 1
  },
  inboundBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  outboundBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  outboundTextBox: {
    backgroundColor: '#73bd32',
    borderRadius: 15,
    borderBottomRightRadius: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5
  },
  inboundTextBox: {
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderColor: '#73bd32',
    borderWidth: 2,
    padding: 10,
  },
  outboundFont: {
    fontSize: 16,
    alignSelf: 'flex-end',
    color: 'white'
  },
  inboundFont: {
    fontSize: 16,
    alignSelf: 'flex-start',
    color: '#555'
  },
  outboundSubtitle: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  inboundSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  subtitle: {
    color: '#555'
  },
  subtitleIcon: {
    marginHorizontal: 3
  },
  link: {
    textDecorationLine: 'underline'
  }
})

export default TextMessage
