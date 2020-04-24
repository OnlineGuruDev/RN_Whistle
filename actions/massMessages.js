import axios from 'axios'
import { BASE_URL } from '../reference/constants'
import {
  RECEIVE_MESSAGE_PREVIEW,
  SET_MM_FORM_FROM_PREVIEW,
  RESET_MM_FORM,
  REMOVE_RECIPIENT_MMFORM,
  CLEAR_MESSAGE_PREVIEW,
  FETCH_RECEIVE_MESSAGE_PREVIEW,
  ADD_RECIPIENT,
  ADD_RECIPIENT_LIST,
  REMOVE_RECIPIENT,
  REMOVE_RECIPIENT_LIST,
  UPDATE_MM_FORM,
  CLEAR_RECIPIENTS,
  IS_SELECTING_LIST,
  SUBMITTING_MASS_MESSAGE,
  STOP_SUBMITTING_MASS_MESSAGE,
  REMOVE_MEDIA,
} from './types'
import { setErrorFlash } from './flash'

export const getMessagePreview = (message, coachId) => dispatch => {
  const attachment = message.attachment ? message.attachment : ''
  dispatch({ type: FETCH_RECEIVE_MESSAGE_PREVIEW, attachment })
  return axios.post(`${BASE_URL}/api/v2/messages/preview`, message, { headers: { onbehalf: coachId } })
    .then(({ data }) => {
      dispatch({ type: RECEIVE_MESSAGE_PREVIEW, data })
      return { ok: true, data }
    })
    .catch(err => {
      dispatch({ type: RECEIVE_MESSAGE_PREVIEW, data: { messages: [] } })
      return { ok: false, errors: err.response.data }
    })
}

export const updateMMForm = (key, value) => dispatch => dispatch({ type: UPDATE_MM_FORM, key, value })

export const resetMMForm = () => dispatch => dispatch({ type: RESET_MM_FORM })

export const clearPreview = () => dispatch => dispatch({ type: CLEAR_MESSAGE_PREVIEW })

export const setMMFormFromPreview = (data, schedule_at, attachment, body, isScheduled, id, kind, storage_file_id) => dispatch => {
  dispatch({ type: SET_MM_FORM_FROM_PREVIEW, data, schedule_at, attachment, body, isScheduled, id, kind, storage_file_id })
}

export const removeRecipientMMForm = (recipientId, name) => dispatch =>
  dispatch({ type: REMOVE_RECIPIENT_MMFORM, recipientId, name })

export const addRecipient = recipientId => dispatch => {
  dispatch({ type: ADD_RECIPIENT, recipientId })
  dispatch(clearPreview())
}

export const addRecipientsToNewMessage = (listId, coachId) => dispatch => {
  dispatch({ type: IS_SELECTING_LIST, listId })
  return axios.get(`${BASE_URL}/api/v2/lists/${listId}/contacts`, { headers: { onbehalf: coachId } })
    .then(({ data }) => {
      dispatch({ type: ADD_RECIPIENT_LIST, recipients: data.map(r => r.id), listId })
      dispatch(clearPreview())
    })
    .catch(res => dispatch(setErrorFlash(res)))
}

export const removeRecipient = recipientId => dispatch => {
  dispatch({ type: REMOVE_RECIPIENT, recipientId })
  dispatch(clearPreview())
}

export const removeRecipientsFromMessage = (listId, coachId) => dispatch => {
  dispatch({ type: IS_SELECTING_LIST, listId })
  return axios.get(`${BASE_URL}/api/v2/lists/${listId}/contacts`, { headers: { onbehalf: coachId } })
    .then(({ data }) => {
      dispatch({ type: REMOVE_RECIPIENT_LIST, recipientsToRemove: data.map(r => r.id), listId })
      dispatch(clearPreview())
    })
    .catch(res => dispatch(setErrorFlash(res)))
}

export const clearRecipients = () => dispatch => dispatch({ type: CLEAR_RECIPIENTS })

export const submittingMassMessage = () => dispatch => dispatch({ type: SUBMITTING_MASS_MESSAGE })

export const stopSubmittingMassMessage = () => dispatch => dispatch({ type: STOP_SUBMITTING_MASS_MESSAGE })

export const removeMedia = () => dispatch => dispatch({ type: REMOVE_MEDIA })
