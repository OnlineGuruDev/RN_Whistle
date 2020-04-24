import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { View, StyleSheet, Text, Image } from 'react-native'
import { COLORS } from '../../reference/constants'
import Touchable from '../shared/Touchable'
import { ContactAvatar } from '../shared/AvatarBubbles'

const MessageItem = ({ item, toConversation }) => {
  const createdDate = moment(item.created_at)
  return (
    <Touchable style={[styles.touchableContainer, !item.is_read && styles.unread]} onPress={() => toConversation(item.contact)}>
      <View style={[styles.touchableContainer, !item.is_read && styles.unread]}>
        <ContactAvatar contact={item.contact} />
        <View style={styles.textContainer}>
          <View style={styles.body}>
            <Text numberOfLines={1} style={styles.contactTitle}>{item.contact.title}</Text>
            <Text style={styles.dateTime}>{createdDate.format('ddd, MMM D')}</Text>
          </View>
          <Text numberOfLines={1} style={styles.messageBody}>
            {`${item.attach_list.length ? '[media] ' : ''}${item.body ? item.body : ''}`}
          </Text>
        </View>
      </View>
    </Touchable>
  )
}

MessageItem.propTypes = {
  item: PropTypes.object.isRequired,
  toConversation: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  touchableContainer: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  unread: {
    backgroundColor: COLORS.LIGHTEST_GREEN
  },
  textAvatar: {
    marginRight: 5,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: COLORS.LIGHT_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  imageAvatar: {
    marginRight: 5,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: 'white',
    fontSize: 17
  },
  textContainer: {
    paddingHorizontal: 5,
    flex: 1
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  },
  contactTitle: {
    fontSize: 17,
    flex: 1,
    paddingRight: 5
  },
  messageBody: {
    flex: 1,
    paddingRight: 5
  },
  dateTime: {
    color: COLORS.LIGHT_GRAY,
    fontSize: 12
  }
})

export default MessageItem
