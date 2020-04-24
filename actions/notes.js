import { BASE_URL } from '../reference/constants'
import {
  RECEIVED_NOTES,
  LOAD_NOTES,
  CREATE_NOTE_SUCCESS,
  DELETE_NOTE_SUCCESS,
  CLEAR_NOTES,
  LOAD_NOTES_FAIL
} from '../actions/types'
import axios from 'axios'
import { setFlash, setErrorFlash } from './flash'

export const loadNotes = contactId => dispatch => {
  dispatch({type: LOAD_NOTES})
  return axios.get(BASE_URL + `/api/v2/contacts/${contactId}/notes`)
    .then(({ data }) => {
      dispatch({ type: RECEIVED_NOTES, notes: data.notes })
    })
    .catch(res => {
      dispatch({ type: LOAD_NOTES_FAIL })
      dispatch(setErrorFlash(res))
    })
}

export const createNote = (note, contactId) => dispatch =>
  axios.post(`${BASE_URL}/api/v2/contacts/${contactId}/notes`, { note })
    .then(({ data, headers }) => {
      dispatch({ type: CREATE_NOTE_SUCCESS, note: data.note, headers })
      return { ok: true }
    })
    .catch(res => {
      dispatch(setErrorFlash(res))
      return { ok: false }
    })

export const deleteNote = (noteId, contactId) => dispatch => {
  axios.delete(`${BASE_URL}/api/v2/contacts/${contactId}/notes/${noteId}`)
    .then(({ data, headers }) => {
      dispatch({ type: DELETE_NOTE_SUCCESS, noteId, headers })
      return { ok: true }
    })
    .catch(res => {
      dispatch(setErrorFlash(res))
      return { ok: false }
    })
}

export const clearNote = () => dispatch => dispatch({ type: CLEAR_NOTES })
