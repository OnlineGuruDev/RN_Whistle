import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../reference/constants'

export default ContactDisplay = ({ contact, relationship }) =>
  <View style={styles.view}>
    <Text numberOfLines={1} style={styles.titleFont}>{contact.title}</Text>
    {relationship
      ? <Text numberOfLines={1} style={styles.subtitleFont}>{relationship}</Text>
      : <Text numberOfLines={1} style={styles.subtitleFont}>{contact.institute || 'N/A'} {contact.year && ` - ${contact.year}`}</Text>
    }
  </View>

ContactDisplay.propTypes = {
  contact: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    paddingHorizontal: 5
  },
  titleFont: {
    fontSize: 18,
    color: COLORS.DARK_GRAY,
  },
  subtitleFont: {
    fontSize: 16,
    color: COLORS.GRAY
  },
})
