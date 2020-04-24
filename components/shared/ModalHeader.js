import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { COLORS } from '../../reference/constants'
import Touchable from './Touchable'

const ModalHeader = ({ title, close }) =>
  <View style={styles.closeContainer}>
    <View style={styles.left}></View>
    <Text style={styles.title}>{title}</Text>
    <Touchable style={styles.right} onPress={close}>
      <Icon style={styles.close} size={32} name='md-close' />
    </Touchable>
  </View>

const styles = StyleSheet.create({
  closeContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: COLORS.DARKEST_GRAY,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
  },
  close: {
    color: '#fff',
    paddingHorizontal: 15,
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  left: {
    flexBasis: 70,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  right: {
    flexBasis: 70,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})

ModalHeader.propTypes = {
  title: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
}

export default ModalHeader
