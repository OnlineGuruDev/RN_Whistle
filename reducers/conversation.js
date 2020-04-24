import {
  SET_CONVERSATION,
  SET_MORE_CONVERSATION,
  APPEND_TO_CONVERSATION,
  LOADING_CONVERSATION,
  LOADING_MORE_CONVERSATION,
  UPDATE_CONVERSATION_ITEM,
  LOGGED_OUT
} from '../actions/types'

const initialState = {
  canLoadMore: false,
  conversation: [],
  isLoaded: false,
  loadingMore: false,
  preview: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CONVERSATION:
      return {
        ...state,
        conversation: action.conversation,
        canLoadMore: action.canLoadMore,
        loadingMore: false,
        isLoaded: true
      }
    case SET_MORE_CONVERSATION:
      return {
        ...state,
        conversation: [ ...state.conversation, ...action.conversation ],
        canLoadMore: action.canLoadMore,
        isLoaded: true,
        loadingMore: false
      }
    case APPEND_TO_CONVERSATION:
      return {
        ...state,
        conversation: [ action.data, ...state.conversation ]
      }
    case LOADING_CONVERSATION:
      return {...state, isLoaded: false }
    case LOADING_MORE_CONVERSATION:
      return {...state, loadingMore: true }
    case 'RECEIVE_CONVERSATION_PREVIEW':
      return { ...state, preview: action.data.messages[0], attachment: action.attachment }
    case UPDATE_CONVERSATION_ITEM: {
      const conversation = state.conversation.map(a => a.id === action.data.id ? {...a, ...action.data} : a)
      return { ...state, conversation}
    }
    case LOGGED_OUT:
      return initialState
    default:
      return state
  }
}
