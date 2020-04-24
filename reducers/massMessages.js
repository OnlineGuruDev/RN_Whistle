import {
  RECEIVE_MESSAGE_PREVIEW,
  SET_MM_FORM_FROM_PREVIEW,
  RESET_MM_FORM,
  REMOVE_RECIPIENT_MMFORM,
  CLEAR_MESSAGE_PREVIEW,
  FETCH_RECEIVE_MESSAGE_PREVIEW,
  ADD_RECIPIENT,
  ADD_RECIPIENT_LIST,
  REMOVE_RECIPIENT,
  REMOVE_RECIPIENT_LIST,
  UPDATE_MM_FORM,
  CLEAR_RECIPIENTS,
  SUBMITTING_MASS_MESSAGE,
  STOP_SUBMITTING_MASS_MESSAGE,
  IS_SELECTING_LIST,
  LOGGED_OUT,
  UPDATE_RECIPIENT,
  REMOVE_MEDIA,
} from '../actions/types'
import difference from 'ramda/src/difference'
import union from 'ramda/src/union'

const initialState = {
  id: 0,
  isFetching: false,
  isLoading: false,
  preview: [],
  recipients: [],
  scheduleDateTime: new Date().toISOString(),
  schedule: false,
  body: '',
  attachment: '',
  localAttachment: '',
  mediaType: '',
  mediaFileName: '',
  kind: '',
  massLists: [],
  submitting: false,
  selectingListIds: [],
  storage_file_id: null,
}

export default function(state = initialState, action) {
  state.kind = state.kind || (action.currentStaff && action.currentStaff.default_send_method) || 'message'
  switch (action.type) {
    case FETCH_RECEIVE_MESSAGE_PREVIEW:
      return { ...state, isLoading: true, attachment: action.attachment }
    case RECEIVE_MESSAGE_PREVIEW:
      return { ...state, preview: action.data.messages, isLoading: false }
    case CLEAR_MESSAGE_PREVIEW:
      return { ...state, preview: [] }
    case UPDATE_MM_FORM:
      return { ...state, [action.key]: action.value }
    case SET_MM_FORM_FROM_PREVIEW: {
      const { data, schedule_at, attachment, body, isScheduled, id, kind, storage_file_id } = action
      return {
        ...state,
        id: isScheduled && id,
        body,
        recipients: data,
        scheduleDateTime: schedule_at,
        schedule: !!schedule_at,
        attachment: attachment || '',
        kind,
        storage_file_id,
      }
    }
    case RESET_MM_FORM:
      return {
        ...state,
        id: 0,
        body: '',
        recipients: [],
        scheduleDateTime: new Date().toISOString(),
        schedule: false,
        attachment: '',
        localAttachment: '',
        mediaType: '',
        mediaFileName: '',
        kind: action.currentStaff && action.currentStaff.default_send_method || 'message',
        storage_file_id: null,
      }
    case REMOVE_RECIPIENT_MMFORM: {
      const preview = state.preview.filter(p => p.to.id !== action.recipientId)
      const recipients = state.recipients.filter(r => r !== action.recipientId)
      return { ...state, recipients, preview }
    }
    case ADD_RECIPIENT:
      return { ...state, recipients: [...state.recipients, action.recipientId] }
    case REMOVE_RECIPIENT: {
      const recipients = state.recipients.filter(rId => rId !== action.recipientId)
      return { ...state, recipients }
    }
    case UPDATE_RECIPIENT:
      const preview = state.preview.map(p => p.to.id == action.recipient.id ? { ...p, to: action.recipient } : p) // eslint-disable-line eqeqeq
      return { ...state, preview }
    case IS_SELECTING_LIST:
      return { ...state, selectingListIds: [ ...state.selectingListIds, action.listId ] }
    case ADD_RECIPIENT_LIST: {
      const recipients = union(state.recipients, action.recipients)
      return {
        ...state,
        recipients,
        massLists: [...state.massLists, action.listId],
        selectingListIds: state.selectingListIds.filter(lId => lId !== action.listId) }
    }
    case REMOVE_RECIPIENT_LIST: {
      const recipients = difference(state.recipients, action.recipientsToRemove)
      const massLists = state.massLists.filter(list => list !== action.listId)
      return {
        ...state,
        recipients,
        massLists,
        selectingListIds: state.selectingListIds.filter(lId => lId !== action.listId) }
    }
    case CLEAR_RECIPIENTS: {
      return { ...state, massLists: [], recipients: [] }
    }
    case REMOVE_MEDIA: {
      return {
        ...state,
        preview: [],
        attachment: '',
        localAttachment: '',
        mediaType: '',
        mediaFileName: '',
        storage_file_id: null,
      }
    }
    case SUBMITTING_MASS_MESSAGE:
      return { ...state, submitting: true }
    case STOP_SUBMITTING_MASS_MESSAGE:
      return { ...state, submitting: false }
    case LOGGED_OUT:
      return initialState
    default:
      return state
  }
}
