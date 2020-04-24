import { BASE_URL } from '../reference/constants'
import {
  VOICE_ACTIVITIES_LOADED,
  MORE_VOICE_ACTIVITIES_LOADED,
  TAG_CALL,
  LOAD_VOICE_ACTIVITIES_ERROR
} from './types'
import axios from 'axios'
import { setErrorFlash } from './flash'

export const loadVoiceActivities = (coachId, page = 0, per_page = 0) => dispatch => {
  const type = page > 1 ? MORE_VOICE_ACTIVITIES_LOADED : VOICE_ACTIVITIES_LOADED
  return axios.get(`${BASE_URL}/api/v2/activities/recent_voice_activities`, {
    headers: { onbehalf: coachId},
    params: { page, per_page }
  })
    .then(({ data }) => {
      dispatch({ type, voiceActivities: data.activities, canLoadMore: data.canLoadMore })
    })
    .catch(res => {
      dispatch({ type: LOAD_VOICE_ACTIVITIES_ERROR })
      dispatch(setErrorFlash(res))
    })
}

export const tagCall = (id, tag) => dispatch => {
  return axios.post(BASE_URL + `/api/v1/calls/tag_call`, {id, tag})
    .then(({ data }) => {
      dispatch({ type: TAG_CALL, id, tag })
      return { ok: true }
    })
    .catch(res => dispatch(setErrorFlash(res)) )
}
