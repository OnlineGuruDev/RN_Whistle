import { BASE_URL } from '../reference/constants'
import {
  RECEIVE_LISTS,
  RECEIVE_LIST,
  FETCH_LISTS,
  TOGGLE_LIST_CONTACT_FROZEN
} from './types'
import axios from 'axios'
import { setFlash, setErrorFlash } from './flash'

export const getLists = coachId => dispatch => {
  dispatch({ type: FETCH_LISTS })
  axios.get(`${BASE_URL}/api/v2/lists/get_lists`, { headers: { onbehalf: coachId } })
    .then(({ data }) => {
      dispatch({ type: RECEIVE_LISTS, data })
      return {ok: true }
    })
    .catch(res => dispatch(setErrorFlash(res)) )
}

export const getListContacts = (listId, coachId) => dispatch => {
  dispatch({ type: FETCH_LISTS })
  axios.get(`${BASE_URL}/api/v2/lists/${listId}/contacts`, { headers: { onbehalf: coachId } })
    .then(({ data }) => {
      dispatch({ type: RECEIVE_LIST, id: listId, contacts: data })
      return {ok: true }
    })
    .catch(res => dispatch(setErrorFlash(res)) )
}

export const toggleFrozenListContact = contactId => dispatch =>
  axios.post(`${BASE_URL}/api/v2/contacts/${contactId}/toggle_frozen`)
  .then(({ data: { contact } }) => {
    dispatch({ type: TOGGLE_LIST_CONTACT_FROZEN, contact })
  })
  .catch(res => dispatch(setErrorFlash(res)) )
