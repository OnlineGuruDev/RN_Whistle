import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text } from 'react-native'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import Touchable from '../shared/Touchable'

const VoicemailBar = ({closeVoicemailBar, audioFile, voicemailSender}) => {
  return (
    <View style={styles.voicebarContainer}>
      <View style={styles.nameText}>
        <Text numberOfLines={1} style={styles.fontColor}>{voicemailSender}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Touchable onPress={() => audioFile.playAsync()}><Icon size={30} style={styles.controlIcon} name='md-play' /></Touchable>
        <Touchable onPress={() => audioFile.pauseAsync()}><Icon size={30} style={styles.controlIcon} name='md-pause' /></Touchable>
        <Touchable onPress={() => audioFile.stopAsync()}><Icon size={30} style={styles.controlIcon} name='md-square' /></Touchable>
        <Touchable><Icon size={30} style={styles.controlIcon} name='ios-call' /></Touchable>
      </View>
      <View>
        <Touchable onPress={closeVoicemailBar}>
          <Text style={styles.fontColor}>Close</Text>
        </Touchable>
      </View>
    </View>
  )
}

VoicemailBar.propTypes = {
  closeVoicemailBar: PropTypes.func.isRequired,
  audioFile: PropTypes.object.isRequired,
  voicemailSender: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  voicebarContainer: {
    height: 50,
    padding: 5,
    backgroundColor: '#444',
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameText: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1
  },
  fontColor: {
    color: '#98c950'
  },
  controlIcon: {
    opacity: 1,
    color: '#fff'
  }
})

export default VoicemailBar
