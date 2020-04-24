import {
  VOICE_ACTIVITIES_LOADED,
  MORE_VOICE_ACTIVITIES_LOADED,
  LOADING_MORE_VOICE_ACTIVITIES,
  LOAD_VOICE_ACTIVITIES_ERROR,
  TAG_CALL,
  LOGGED_OUT
} from '../actions/types'

const initialState = {
  canLoadMore: false,
  current_voicemail_url: '',
  isLoaded: false,
  loadingMore: false,
  voiceActivities: [],
}

const voiceActivities = (state = initialState, action) => {
  if (!action) return state
  switch (action.type) {
    case LOAD_VOICE_ACTIVITIES_ERROR:
      return {
        ...state,
        isLoaded: true,
        loadingMore: false
      }
    case VOICE_ACTIVITIES_LOADED: {
      return {
        ...state,
        canLoadMore: action.canLoadMore,
        voiceActivities: action.voiceActivities,
        isLoaded: true,
        loadingMore: false
      }
    }
    case MORE_VOICE_ACTIVITIES_LOADED: {
      return {
        ...state,
        canLoadMore: action.canLoadMore,
        voiceActivities: [...state.voiceActivities, ...action.voiceActivities],
        isLoaded: true,
        loadingMore: false
      }
    }
    case TAG_CALL: {
      return {
        ...state,
        voiceActivities: state.voiceActivities.map(c => {
          if (c.id === action.id) { return ({...c, call_tag: action.tag}) } else { return c }
        })
      }
    }
    case LOADING_MORE_VOICE_ACTIVITIES:
      return {
        ...state,
        loadingMore: true
      }
    case LOGGED_OUT:
      return initialState
    default:
      return state
  }
}

export default voiceActivities
