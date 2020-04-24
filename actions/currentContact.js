import {
  UPDATE_RECIPIENT,
  SET_CURRENT_CONTACT,
  CLEAR_CURRENT_CONTACT,
  CONTACT_UPDATED,
} from './types'
import axios from 'axios'
import { BASE_URL } from '../reference/constants'
import { setFlash, setErrorFlash } from './flash'

export const setCurrent = contact => dispatch => {
  dispatch({ type: SET_CURRENT_CONTACT, contact })
}

export const clearCurrentContact = () => dispatch => {
  dispatch({ type: CLEAR_CURRENT_CONTACT })
}

export const toggleFrozenCurrentContact = (contactId, freezed) => dispatch => {
  dispatch({ type: CONTACT_UPDATED, data: { freezed } })
  axios.post(`${BASE_URL}/api/v2/contacts/${contactId}/toggle_frozen`)
    .then(({ data: { contact } }) => {
      // this is here to manage going back and forth between MMsgs and contact.profile
      dispatch({ type: UPDATE_RECIPIENT, recipient: contact })
    })
    .catch(res => {
      dispatch({ type: CONTACT_UPDATED, data: { freezed: !freezed } })
      dispatch(setErrorFlash(res))
    })
}

export const deleteContact = contactId => dispatch =>
  axios.delete(`${BASE_URL}/api/v2/contacts/${contactId}`)
    .then(({ data, headers }) => {
      dispatch(setFlash('Contact deleted.'))
      return { ok: true }
    })
    .catch(response => {
      dispatch(setErrorFlash(response))
      return { ok: false }
    })
