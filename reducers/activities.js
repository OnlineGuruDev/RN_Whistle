import {
  ACTIVITIES_LOADED,
  MORE_ACTIVITIES_LOADED,
  SET_NEW_ACTIVITY,
  APPEND_TO_ACTIVITIES,
  LOGGED_OUT,
  LOADING_ACTIVITIES,
  LOADING_MORE_ACTIVITIES,
  LOADING_ACTIVITIES_COMPLETE,
} from '../actions/types'

const initialState = {
  activities: [],
  canLoadMore: false,
  isLoaded: false,
  loadingMore: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_NEW_ACTIVITY: {
      let activities = state.activities.map(activity =>
        activity.contact.id === action.message.contact.id ? action.message : activity
      )
      return {
        ...state,
        activities: activities
      }
    }
    case ACTIVITIES_LOADED:
      return {
        ...state,
        activities: action.activities,
        isLoaded: true,
        canLoadMore: action.canLoadMore
      }
    case MORE_ACTIVITIES_LOADED:
      return {
        ...state,
        activities: [...state.activities, ...action.activities],
        canLoadMore: action.canLoadMore,
        loadingMore: false,
        isLoaded: true
      }
    case APPEND_TO_ACTIVITIES:
      return {...state, activities: [ action.data, ...state.activities ]}
    case LOADING_ACTIVITIES:
      return {...state, isLoaded: false }
    case LOADING_ACTIVITIES_COMPLETE:
      return {...state, isLoaded: true }
    case LOADING_MORE_ACTIVITIES:
      return {...state, loadingMore: true }
    case LOGGED_OUT:
      return initialState
    default:
      return state
  }
}
