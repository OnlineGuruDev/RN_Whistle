import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text } from 'react-native'

const ScheduledSentAvatar = ({ num }) => {
  if (num === 2) {
    return (
      <View style={styles.avatarContainer}>
        <View style={[styles.multipleCircle, styles.secondCircle]} />
        <View style={[styles.multipleCircle, styles.thirdCircle]}>
          <Text style={styles.smallAvatarFont}>{num}</Text>
        </View>
      </View>
    )
  }

  if (num > 2) {
    return (
      <View style={styles.avatarContainer}>
        <View style={[styles.multipleCircle, styles.firstCircle]} />
        <View style={[styles.multipleCircle, styles.secondCircle]} />
        <View style={[styles.multipleCircle, styles.thirdCircle]}>
          <Text style={num > 999 ? styles.verySmallAvatarFont : styles.smallAvatarFont}>{num}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.avatarContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarFont}>{num}</Text>
      </View>
    </View>
  )
}

ScheduledSentAvatar.propTypes = {
  num: PropTypes.number.isRequired
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#73bd32',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarFont: {
    fontSize: 18,
    color: '#fff'
  },
  smallAvatarFont: {
    fontSize: 14,
    color: '#fff'
  },
  verySmallAvatarFont: {
    fontSize: 10,
    color: '#fff'
  },
  firstCircle: {
    position: 'absolute',
    left: 0,
    top: 0
  },
  secondCircle: {
    position: 'absolute',
    left: 5,
    top: 5
  },
  thirdCircle: {
    position: 'absolute',
    left: 10,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  multipleCircle: {
    backgroundColor: '#73bd32',
    height: 35,
    width: 35,
    borderRadius: 20,
    borderColor: '#fff',
    borderWidth: 2
  },
  avatarContainer: {
    flexBasis: 45,
    height: 45,
    marginRight: 15
  }
})

export default ScheduledSentAvatar
