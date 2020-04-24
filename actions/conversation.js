import axios from 'axios'
import { BASE_URL } from '../reference/constants'
import {
  SET_CONVERSATION,
  SET_MORE_CONVERSATION,
  LOADING_CONVERSATION,
  LOADING_MORE_CONVERSATION,
} from './types'
import { setErrorFlash } from './flash'

export const loadContactConversation = (contactId, coachId, page = 1, per_page = 0, source = {}) => dispatch => {
  dispatch({ type: page > 1 ? LOADING_MORE_CONVERSATION : LOADING_CONVERSATION })
  return axios.get(`${BASE_URL}/api/v2/activities/conversation/${contactId}`, {
    cancelToken: source.token,
    params: { page, per_page },
    headers: { onbehalf: coachId },
  })
    .then(({ data }) => {
      console.log("loading========" + contactId)
      dispatch({
        type: page > 1 ? SET_MORE_CONVERSATION : SET_CONVERSATION,
        conversation: data.conversation,
        canLoadMore: data.canLoadMore,
        contact: data.contact,
      })
      return { ok: true }
    })
    .catch(err => {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message)
      } else {
        dispatch(setErrorFlash(err))
      }
      return { ok: false }
    })
}

export const getMessagePreview = (message, coachId) => dispatch => {
  return axios.post(`${BASE_URL}/api/v2/messages/preview`, message, { headers: { onbehalf: coachId } })
    .then(({ data }) => {
      const attachment = message.attachment ? message.attachment : ''
      dispatch({ type: 'RECEIVE_CONVERSATION_PREVIEW', data, attachment })
      return { ok: true }
    })
    .catch(err => {
      dispatch({ type: 'RECEIVE_MESSAGE_PREVIEW', data: { messages: [] } })
      return { ok: false, errors: err.response.data }
    })
}
