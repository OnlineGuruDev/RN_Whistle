import {
  RECEIVE_WID_FIELDS,
  LOGGED_OUT
} from '../actions/types'

const initialState = {
  fields: []
}

const wIDFields = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_WID_FIELDS:
      return { ...state, fields: action.field_names }
    case LOGGED_OUT:
      return initialState
    default:
      return state
  }
}

export default wIDFields
