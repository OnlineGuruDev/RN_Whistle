import {
  SET_CURRENT_CONTACT,
  LOADING_CONVERSATION,
  SET_CONVERSATION,
  RECEIVED_NOTES,
  CREATE_NOTE_SUCCESS,
  CLEAR_NOTES,
  DELETE_NOTE_SUCCESS,
  CLEAR_CURRENT_CONTACT,
  LOAD_NOTES,
  LOAD_NOTES_FAIL,
  LOGGED_OUT,
  UPDATING_CONTACT,
  CONTACT_UPDATED,
  LOADING_CURRENT_CONTACT,
  LOADING_CURRENT_CONTACT_COMPLETE,
} from '../actions/types'

const initialState = {
  data: {},
  notes: [],
  whistle_pics: [],
  isSelecting: false,
  submitting: false,
  loadingNotes: false,
  loading: false,
}

const currentContact = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONVERSATION:
    case SET_CURRENT_CONTACT:
      return { ...state, data: action.contact }
    case LOAD_NOTES:
      return { ...state, loadingNotes: true }
    case LOAD_NOTES_FAIL:
      return { ...state, loadingNotes: false }
    case RECEIVED_NOTES:
      return { ...state, notes: action.notes, loadingNotes: false }
    case CLEAR_NOTES:
      return { ...state, notes: [] }
    case CREATE_NOTE_SUCCESS:
      return { ...state, notes: [ action.note, ...state.notes ] }
    case DELETE_NOTE_SUCCESS: {
      const notes = state.notes.filter(n => n.id !== action.noteId)
      return { ...state, notes }
    }
    case UPDATING_CONTACT:
      return { ...state, submitting: action.data }
    case CONTACT_UPDATED:
      return { ...state, data: { ...state.data, ...action.data} }
    case LOADING_CURRENT_CONTACT:
      return { ...state, loading: true }
    case LOADING_CURRENT_CONTACT_COMPLETE:
      return { ...state, loading: false }
    case CLEAR_CURRENT_CONTACT:
    case LOADING_CONVERSATION:
    case LOGGED_OUT:
      return initialState
    default:
      return state
  }
}

export default currentContact
