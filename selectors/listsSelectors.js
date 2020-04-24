import { createSelector } from 'reselect'

const getLists = state => state.lists.lists

const getActiveListId = state => state.lists.activeListId

export const getActiveList = createSelector(
  [getLists, getActiveListId],
  (lists, activeId) => lists.find(l => l.id === parseInt(activeId)) || {}
)
