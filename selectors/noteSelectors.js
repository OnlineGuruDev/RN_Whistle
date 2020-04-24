import { createSelector } from 'reselect'
import sort from 'ramda/src/sort'
import prop from 'ramda/src/prop'
import descend from 'ramda/src/descend'

const getNotes = state => state.currentContact.notes

export const getSortedNotes = createSelector(getNotes, sort(descend(prop('created_at'))))
