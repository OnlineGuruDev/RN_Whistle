import { BASE_URL } from '../reference/constants'
import {
  UPDATE_RECIPIENT,
  LOAD_MORE_CONTACTS,
  CONTACTS_LOADED,
  MORE_CONTACTS_LOADED,
  CONTACT_UPDATED,
  UPDATING_CONTACT,
  ADD_CONTACT,
  LOADING_CURRENT_CONTACT,
  LOADING_CURRENT_CONTACT_COMPLETE,
} from './types'

import axios from 'axios'
import { setFlash, setErrorFlash } from './flash'
import { setCurrent } from './currentContact'

export const loadContacts = (page = 1, query = '') => dispatch => {
  if (page > 1) dispatch({ type: LOAD_MORE_CONTACTS })
  return axios.get(`${BASE_URL}/api/v2/contacts/mobile_index`, { params: { page, query }})
    .then(({ data }) => {
      dispatch({
        type: page === 1 ? CONTACTS_LOADED : MORE_CONTACTS_LOADED,
        contacts: data.contacts,
        canLoadMore: data.canLoadMore })
    })
    .catch(res => dispatch(setErrorFlash(res)) )
}

export const loadContact = id => dispatch => {
  dispatch({ type: LOADING_CURRENT_CONTACT })
  return axios.get(`${BASE_URL}/api/v2/contacts/${id}`)
    .then(({ data: { contact } }) => {
      dispatch(setCurrent(contact))
    })
    .catch(res => dispatch(setErrorFlash(res)) )
    .finally(() => {
      dispatch({ type: LOADING_CURRENT_CONTACT_COMPLETE })
      return true
    })
}

export const updateContact = (id, contact) => dispatch => {
  dispatch({ type: UPDATING_CONTACT, data: true})
  return axios.put(`${BASE_URL}/api/v2/contacts/${id}.json`, contact)
    .then(({data: { contact }}) => {
      // this updates the recipients array in messenger. When user updates a contact from the messenger,
      // they return to message preview and would like to see the contact updated accordingly.
      dispatch({ type: UPDATE_RECIPIENT, recipient: contact })
      dispatch(setFlash('Contact updated.'))
      dispatch({ type: UPDATING_CONTACT, data: false})
      return { ok: true}
    })
    .catch(({ response }) => {
      dispatch(setErrorFlash(res))
      dispatch({ type: UPDATING_CONTACT, data: false})
      return { ok: false}
    })
  }

export const addContact = attributes => dispatch => {
  const contact = {metadata: {fields: {...attributes}}}
  return axios.post(`${BASE_URL}/api/v2/contacts/create_mobile`, contact)
  .then(({ data: { contact } }) => {
    dispatch({ type: ADD_CONTACT, contact })
    return { ok: true }
  })
  .catch(res => dispatch(setErrorFlash(res)) )
}
