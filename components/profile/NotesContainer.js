import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, TextInput, StyleSheet, Alert } from 'react-native'
//import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'; 

import { createNote, deleteNote } from '../../actions/notes'
import { getSortedNotes } from '../../selectors/noteSelectors'
import { COLORS } from '../../reference/constants'

import Notes from './Notes'
import Touchable from '../shared/Touchable'
import Loader from '../shared/Loader'
import KeyboardView from '../shared/KeyboardView'

class NotesContainer extends React.Component{
  state = { note: "" }

  deleteNote = noteId => this.props.deleteNote(noteId, this.props.contact.data.id)

  deleteConfirm = noteId => {
    Alert.alert(
      'Confirm',
      'Delete Note?',
      [
        {text: 'Cancel'},
        {text: 'OK', onPress: () => this.deleteNote(noteId)}
      ]
    )
  }

  saveNote = () => {
    if (!this.state.note.trim()) return
    const { createNote, contact } = this.props
    createNote({note: this.state.note}, contact.data.id)
      .then(res => {
        if (res.ok) {
          this.setState({note: ''})
        }
      })
  }

  render() {
    if (this.props.loading) return <Loader />
    return (
      <View style={styles.container}>
        <Notes notes={this.props.notes} deleteNote={this.deleteConfirm}/>
        <KeyboardView offset={56 + 50 + 95}>
          <View style={styles.footer}>
            <View style={styles.inputContainer}>
              <TextInput
                multiline={true}
                underlineColorAndroid="transparent"
                value={this.state.note}
                placeholder="Type a note..."
                style={styles.messageInput}
                onChangeText={v => this.setState({note: v})}
              />
            </View>
            <Touchable onPress={this.saveNote}>
              <View style={styles.send}>
                <Icon name='arrow-circle-up' color='#73bd32' size={44} />
              </View>
            </Touchable>
          </View>
        </KeyboardView>
      </View>
    )
  }
}

NotesContainer.propTypes = {
  createNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  notes: PropTypes.array.isRequired,
  contact: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingLeft: 5
  },
  inputContainer: {
    flex: 1,
  },
  messageInput: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    paddingHorizontal: 9,
    flexGrow: 1,
    borderRadius: 15,
    alignContent: 'center',
    maxHeight: 200,
    minHeight: 30
  },
  send: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitText: {
    color: '#333'
  }
})

const mapStateToProps = (state) => {
  return{
    loading: state.currentContact.loadingNotes,
    contact: state.currentContact,
    notes: getSortedNotes(state)
  }
}

export default connect(mapStateToProps, {
  createNote,
  deleteNote,
})(NotesContainer)
