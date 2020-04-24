import { BASE_URL } from '../reference/constants'
import axios from 'axios'
import {
  SET_NEW_ACTIVITY,
  APPEND_TO_CONVERSATION,
} from './types'
import { stopSubmittingMassMessage } from './massMessages'
import { setFlash } from './flash'

export const createMessage = (data, staffID) => dispatch =>
  axios.post(`${BASE_URL}/api/v2/messages`, data, { headers: { onbehalf: staffID } })
    .then(({ data: { message } }) => {
      if (message.schedule_at) {
        dispatch(setFlash('Message scheduled!'))
      } else if (message) {
        dispatch({ type: SET_NEW_ACTIVITY, message })
        dispatch({ type: APPEND_TO_CONVERSATION, data: message })
      }
      return { ok: true }
    })
    .catch(err => {
      return { ok: false, error: err }
    })

export const createGroupMessage = (data, staffID) => dispatch =>
  axios.post(`${BASE_URL}/api/v2/messages`, data, { headers: { onbehalf: staffID } })
    .then(res => {
      dispatch(stopSubmittingMassMessage())
      return { ok: true }
    })
    .catch(err => {
      dispatch(stopSubmittingMassMessage())
      return { ok: false, error: err }
    })

export const updateMessage = (data, messageId) => dispatch =>
  axios.put(`${BASE_URL}/api/v2/messages/${messageId}`, data)
    .then(res => {
      return { message: res.data.message, ok: true }
    })
    .catch(err => {
      return { ok: false, error: err }
    })

export const removeMessage = (messageId, coachId) => dispatch =>
  axios.delete(`${BASE_URL}/api/v2/messages/${messageId}`, { headers: { onbehalf: coachId } })
    .then(res => {
      dispatch(setFlash('Message canceled!'))
      return { ok: true }
    })
    .catch(err => {
      return { ok: false, errors: err.response.data }
    })
