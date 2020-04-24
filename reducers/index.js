import { combineReducers } from 'redux'
import activities from './activities'
import conversation from './conversation'
import currentContact from './currentContact'
import currentStaff from './currentStaff'
import flash from './flash'
import lists from './lists'
import massMessages from './massMessages'
import contacts from './contacts'
import user from './user'
import voiceActivities from './voiceActivities'
import wIDFields from './wIDFields'

const rootReducer = (state = {}, action) => {
  const staff = currentStaff(state.currentStaff, action)
  return {
    activities: activities(state.activities, action),
    contacts: contacts(state.contacts, action),
    conversation: conversation(state.conversation, action),
    currentContact: currentContact(state.currentContact, action),
    currentStaff: staff,
    flash: flash(state.flash, action),
    lists: lists(state.lists, action),
    massMessages: massMessages(state.massMessages, {...action, currentStaff: staff}),
    user: user(state.user, action),
    voiceActivities: voiceActivities(state.voiceActivities, action),
    wIDFields: wIDFields(state.wIDFields, action)
  }
}

export default rootReducer
