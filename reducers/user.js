import {
  LOGGED_IN,
  FETCHING_AUTH,
  FETCHING_AUTH_COMPLETE,
  RECEIVE_CALL_TAGS,
  RECEIVE_ONBEHALF,
  USER_INFO_UPDATED,
  USER_INFO_SUBMITTING,
  TOKEN_CHECK_COMPLETE,
  LOGGED_OUT,
  UPDATE_TERMS_AGREEMENT,
} from '../actions/types'

// TODO: nest user like so -> user: { isLoggedIn: false, user: {}, coaches: [] }
const initialState = {
  tokenChecked: false,
  isFetchingAuth: false,
  isLoggedIn: false,
  notification: {},
  call_tags: [],
  raw_call_tags: {},
  coaches: [],
  submitting: false,
}

const User = (state = initialState, action) => {
  switch (action.type) {
    case LOGGED_IN:
      return { ...state, isLoggedIn: true, isFetchingAuth: false, ...action.data.data }
    case FETCHING_AUTH:
      return { ...state, isFetchingAuth: true }
    case FETCHING_AUTH_COMPLETE:
      return { ...state, isFetchingAuth: false }
    case TOKEN_CHECK_COMPLETE:
      return { ...state, tokenChecked: true }
    case RECEIVE_CALL_TAGS: {
      if (!action.tags) {
        return {
          ...state,
          call_tags: []
        }
      }
      let tags = []
      for (let tag in action.tags) {
        tags.push({
          key: tag,
          value: action.tags[tag]
        })
      }
      return {
        ...state,
        call_tags: tags,
        raw_call_tags: action.tags
      }
    }
    case USER_INFO_SUBMITTING:
      return {
        ...state,
        submitting: action.data
      }
    case RECEIVE_ONBEHALF:
      return { ...state, coaches: action.data }
    case USER_INFO_UPDATED: {
      let data = action.data
      return {
        ...state,
        ...data
      }
    }
    case UPDATE_TERMS_AGREEMENT: {
      return { ...state, terms_agreement: true }
    }
    case LOGGED_OUT:
      return { ...initialState, tokenChecked: true }
    default:
      return state
  }
}

export default User
