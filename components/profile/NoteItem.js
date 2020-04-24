import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { displayDate } from '../../reference/functions'

import { StaffAvatar } from '../shared/AvatarBubbles'
import Touchable from '../shared/Touchable'

const NoteItem = ({ item, deleteNote }) =>
  <View key={item.id} style={styles.noteContainer}>
    <StaffAvatar small name={item.staff.name} image={item.staff.picture} />
    <View style={styles.container}>
      <View style={styles.noteHeader}>
        <Text style={styles.name}>{item.staff.name}</Text>
        <Text>{displayDate(item.created_at)}</Text>
      </View>
      <View style={styles.container}>
        <Text>{item.note}</Text>
      </View>
    </View>
    <Touchable style={styles.deleteNote} onPress={() => deleteNote(item.id)}>
      <Icon size={20} color='#d9534f' name='md-close' />
    </Touchable>
  </View>

NoteItem.propTypes = {
  deleteNote: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  noteHeader: {
    flexDirection: 'row'
  },
  name: {
    fontWeight: 'bold',
    marginRight: 5
  },
  deleteNote: {
    position: 'absolute',
    top: 2,
    right: 7
  },
  noteContainer: {
    flexDirection: 'row',
    flex: 1,
    margin: 5,
    backgroundColor: '#e8ece7',
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 5
  }
})

export default NoteItem
