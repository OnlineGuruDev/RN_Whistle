import axios from 'axios'
import { BASE_URL } from '../reference/constants'
import {
  ACTIVITIES_LOADED,
  MORE_ACTIVITIES_LOADED,
  LOADING_ACTIVITIES,
  LOADING_MORE_ACTIVITIES,
  LOADING_ACTIVITIES_COMPLETE
} from './types'
import { setFlash, setErrorFlash } from './flash'

export const loadingActivitiesComplete = () => dispatch => dispatch({type: LOADING_ACTIVITIES_COMPLETE })

export const loadActivities = (coachId, page = 0) => dispatch => {
  if (page > 1) {
    dispatch({type: LOADING_MORE_ACTIVITIES})
  } else {
    dispatch({type: LOADING_ACTIVITIES})
  }

  let type = page > 1 ? MORE_ACTIVITIES_LOADED : ACTIVITIES_LOADED

  return axios.get(`${BASE_URL}/api/v2/activities/recent_activities`, {
    params: { page },
    headers: { onbehalf: coachId }})
    .then(({ data }) => {
      dispatch({ type, canLoadMore: data.canLoadMore, activities: data.activities })
      dispatch(loadingActivitiesComplete())
      return {canLoadMore: data.canLoadMore}
    })
    .catch(res => {
      console.log(res)
      dispatch(loadingActivitiesComplete())
      dispatch(setErrorFlash(res))
    })
}

export const markActivityRead = (activityId) => dispatch =>
  axios.get(`${BASE_URL}/api/v1/activities/mark_read/${activityId}`)
    .then(({ data, headers }) => {
      return { ok: true }
    })
    .catch(res => {
      dispatch(setErrorFlash(res))
      return { ok: false }
    })

export const resend = (activityId, coachId) => dispatch => {
  axios.post(BASE_URL + `/api/v2/activities/${activityId}/resend`, {}, { headers: { onbehalf: coachId }})
    .then(({ data }) => {
      return { ok: true }
    })
    .catch(res => {
      // couldn't resend flash
      dispatch(setErrorFlash(res))
      return { ok: false }
    })
}