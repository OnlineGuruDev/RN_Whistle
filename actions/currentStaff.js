import {
  SET_CURRENT_STAFF,
  SET_COACH_CURRENT_STAFF,
  RESET_MM_FORM
} from './types'

export const setCurrentStaff = id => (dispatch, getStore) => {
  let staff = getStore().user.coaches.find(c => c.id === id) || {}
  dispatch({ type: SET_CURRENT_STAFF, staff })
  dispatch({ type: RESET_MM_FORM })
}

export const setCoachCurrentStaff = user => dispatch => {
  dispatch({ type: SET_COACH_CURRENT_STAFF, staff: user })
  dispatch({ type: RESET_MM_FORM })
}
