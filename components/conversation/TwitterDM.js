import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
//import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'; 

import { View, Text, StyleSheet } from 'react-native'
import Hyperlink from 'react-native-hyperlink'
import { COLORS } from '../../reference/constants'
import { displayDate } from '../../reference/functions'
import InboundAvatar from './InboundAvatar'
import ImageModal from '../shared/ImageModal'
import StatusIcon from './StatusIcon'
import MessageStatus from './MessageStatus'
import Media from './Media'

class TwitterDM extends PureComponent {
  render() {
    const { inbound, item, localAttachment, contact } = this.props
    return (
      <View style={[styles.container, inbound ? styles.inbound : styles.outbound]}>
        <InboundAvatar contact={contact} inbound={inbound} />
        <View>
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
            <Icon style={[styles.subtitle, styles.subtitleIcon]} name="twitter" size={18} />
            <Text style={styles.subtitle}>{ displayDate(item.created_at) }</Text>
          </View>
        </View>
      </View>
    )
  }
}

TwitterDM.propTypes = {
  item: PropTypes.object.isRequired,
  inbound: PropTypes.bool.isRequired,
  localAttachment: PropTypes.string
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 5
  },
  inbound: {
    justifyContent: 'flex-start',
    marginRight: 30
  },
  outbound: {
    justifyContent: 'flex-end',
    paddingLeft: 30
  },
  inboundBody: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  outboundBody: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  outboundTextBox: {
    backgroundColor: COLORS.TWITTER_LIGHT,
    borderRadius: 15,
    borderBottomRightRadius: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5
  },
  inboundTextBox: {
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderColor: COLORS.TWITTER_LIGHT,
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

export default TwitterDM
