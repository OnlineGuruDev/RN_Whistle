import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { displayDate } from '../../reference/functions'
import InboundAvatar from './InboundAvatar'
//import FontAwesome from '@expo/vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome'; 

class VoiceMessage extends PureComponent {
  render() {
    const { inbound, item, contact } = this.props
    return (
      <View style={[styles.container, inbound && styles.inbound]}>
        <InboundAvatar contact={contact} inbound={inbound} />
        <View>
          <View style={inbound ? styles.inboundCallBox : styles.outboundCallBox}>
            <Text selectable style={styles.outboundFont}>{item.body}</Text>
            { item.call_tag === 'countable_call' &&
              <Text style={styles.countableFont}>Countable Call</Text> }
          </View>
          <View style={inbound ? styles.inboundSubtitle : styles.outboundSubtitle}>
            { inbound && <Icon style={[styles.subtitle, styles.subtitleIcon]} name="phone" size={20}/> }
            <Text style={inbound ? styles.inboundTimeStamp : styles.outboundTimeStamp}>{ displayDate(item.created_at) }</Text>
            { !inbound && <Icon style={[styles.subtitle, styles.subtitleIcon]} name="phone" size={20}/> }
          </View>
        </View>
      </View>
    )
  }
}

VoiceMessage.propTypes = {
  inbound: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 5,
    justifyContent: 'flex-end'
  },
  inbound: {
    justifyContent: 'flex-start',
    marginRight: 30
  },
  outboundCallBox: {
    backgroundColor: '#555',
    maxWidth: 300,
    borderRadius: 15,
    padding: 10,
    borderBottomRightRadius: 0
  },
  inboundCallBox: {
    maxWidth: 300,
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    padding: 10,
    backgroundColor: '#555'
  },
  outboundFont: {
    fontSize: 16,
    color: 'white'
  },
  countableFont: {
    fontSize: 12,
    color: '#73bd32'
  },
  outboundSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  inboundSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  outboundTimeStamp: {
    color: '#555',
    alignSelf: 'flex-end'
  },
  inboundTimeStamp: {
    color: '#555',
    alignSelf: 'flex-start'
  },
  subtitle: {
    color: '#555'
  },
  subtitleIcon: {
    marginLeft: 3
  },
})

export default VoiceMessage
