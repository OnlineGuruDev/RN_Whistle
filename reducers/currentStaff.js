import {
  SET_CURRENT_STAFF,
  SET_COACH_CURRENT_STAFF,
  LOGGED_OUT
} from '../actions/types'

const initialState = {}

const currentStaff = (state = initialState, action) => {
  if (!action) return state
  switch (action.type) {
    case SET_CURRENT_STAFF: {
      return {
        ...state,
        ...action.staff
      }
    }
    case SET_COACH_CURRENT_STAFF: {
      return {
        ...state,
        ...action.staff
      }
    }
    case LOGGED_OUT:
      return initialState
    default:
      return state
  }
}

export default currentStaff
