import {
  RECEIVE_LISTS,
  RECEIVE_LIST,
  TOGGLE_LIST_CONTACT_FROZEN,
  FETCH_LISTS,
  LOGGED_OUT
} from '../actions/types'

const initialState = {
  lists: [],
  contacts: [],
  isLoading: true,
  activeListId: null
}

const List = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_LISTS:
      return { ...state, lists: action.data.lists, isLoading: false }
    case RECEIVE_LIST:
      return {
        ...state,
        activeListId: action.id,
        contacts: action.contacts,
        isLoading: false
      }
    case TOGGLE_LIST_CONTACT_FROZEN: {
      let contacts = state.contacts.map(r => r.id === action.contact.id
        ? { ...r, freezed: action.contact.freezed }
        : r)
      return { ...state, contacts }
    }
    case FETCH_LISTS:
      return { ...state, isLoading: true }
    case LOGGED_OUT:
      return initialState
    default:
      return state
  }
}

export default List
