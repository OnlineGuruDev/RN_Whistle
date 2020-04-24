import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import { ContactAvatar } from '../shared/AvatarBubbles'

const InboundAvatar = ({ contact, inbound }) => inbound &&
  <View style={styles.avatarContainer}>
    <ContactAvatar small size={40} contact={contact}/>
  </View>

InboundAvatar.propTypes = {
  contact: PropTypes.object,
  inbound: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
  avatarContainer: {
    justifyContent: 'flex-end',
    marginRight: 5
  }
})

export default InboundAvatar
