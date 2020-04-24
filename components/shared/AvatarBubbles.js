import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { COLORS } from '../../reference/constants'
import { getInitials } from '../../reference/functions'
import { ContactSVG } from '../../images/SVGImages'

export const ListAvatar = ({list}) => list.list_picture
  ? <Image source={{uri: list.list_picture}} style={[styles.avatar, styles.listAvatar]} />
  : <View style={[styles.avatar, styles.listAvatar, { backgroundColor: list.accent_color }]}>
      <Text style={styles.avatarFont}>{getInitials(list.name)}</Text>
    </View>

export const StaffAvatar = ({name, image=null, small}) => image
  ? <Image source={{uri: image}} style={[styles.avatar, small && styles.small]} />
  : <View style={[styles.avatar, styles.textAvatar, small && styles.small]}>
      <Text style={[styles.avatarFont]}>{getInitials(name)}</Text>
    </View>

export const ContactAvatar = ({ small, large, size=50, contact={} }) => contact.picture
  ? <Image source={{uri: contact.picture}} style={[styles.imageAvatar, small && styles.small, large && styles.large]} />
  : <ContactSVG size={size} background={contact.accent_color} />

const styles = StyleSheet.create({
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 5
  },
  imageAvatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  small: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  large: {
    height: 60,
    width: 60,
    borderRadius: 30
  },
  textAvatar: {
    backgroundColor: COLORS.LIGHT_GREEN,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listAvatar: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarFont: {
    fontSize: 18,
    color: COLORS.WHITE
  },
  border: {
    borderWidth: 1,
    borderColor: COLORS.GRAY
  },
})
