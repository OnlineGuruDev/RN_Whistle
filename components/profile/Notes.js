import React from 'react'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'
import NoteItem from './NoteItem'
import MsgScreen from '../shared/MsgScreen'

const Notes = ({ notes, deleteNote }) => {
  if (!notes.length) return <MsgScreen message="Contact doesn't have any notes. Add a note below." />
  return (
    <FlatList
      keyboardShouldPersistTaps='handled'
      data={notes}
      renderItem={({item}) => <NoteItem item={item} deleteNote={deleteNote} />}
      keyExtractor={item => `${item.id}`}
    />
  )
}

Notes.propTypes = {
  deleteNote: PropTypes.func.isRequired,
  notes: PropTypes.array.isRequired,
}

export default Notes
