import {
  ADD_CONTACT,
  CONTACTS_LOADED,
  MORE_CONTACTS_LOADED,
  LOAD_MORE_CONTACTS,
  UPDATE_CONTACT_QUERY,
  LOGGED_OUT,
} from '../actions/types'

const initialState = {
  contacts: [],
  contactSearchQuery: '',
  isLoaded: false,
  loadingMore: false,
  canLoadMore: false,
}

const Contacts = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MORE_CONTACTS:
      return { ...state, loadingMore: true }
    case ADD_CONTACT:
      return { ...state, contacts: [ ...state.contacts, action.contact ] }
    case CONTACTS_LOADED:
      return {
        ...state,
        isLoaded: true,
        contacts: action.contacts,
        canLoadMore: action.canLoadMore,
      }
    case MORE_CONTACTS_LOADED:
      return {
        ...state,
        isLoaded: true,
        loadingMore: false,
        canLoadMore: action.canLoadMore,
        contacts: [ ...state.contacts, ...action.contacts ] }
    case UPDATE_CONTACT_QUERY:
      return { ...state, contactSearchQuery: action.query, isLoaded: false }
    case LOGGED_OUT:
      return initialState
    default:
      return state
  }
}

export default Contacts
