import { createSelector } from 'reselect'
import { orderByScheduleAtDesc, orderByScheduleAtAsc } from '../reference/functions'
import sort from 'ramda/src/sort'
import map from 'ramda/src/map'
import prop from 'ramda/src/prop'
import find from 'ramda/src/find'
import propEq from 'ramda/src/propEq'
import compose from 'ramda/src/compose'

const getAllLists = state => state.lists.lists
const getListSearchQuery = state => state.lists.listSearchQuery

export const getListsSearchResults = createSelector(
  [getAllLists, getListSearchQuery],
  (lists, query) => lists.filter(l => l.name.toLowerCase().includes(query.toLowerCase()))
)

const getScheduledMessages = state => state.massMessages.scheduled
const getSentMessages = state => state.massMessages.sent

export const getSortedScheduledMsgs = createSelector(
  [ getScheduledMessages ], sort(orderByScheduleAtAsc)
)

export const getSortedSentMsgs = createSelector(
  [ getSentMessages ], sort(orderByScheduleAtDesc)
)

const getRecipients = state => state.massMessages.recipients

export const getRecipientIds = createSelector(
  [getRecipients], map(r => r.id)
)
