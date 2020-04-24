import { createSelector } from 'reselect'
import isEmpty from 'ramda/src/isEmpty'

const getUser = state => state.user
const getCurrentStaff = state => state.currentStaff

export const getSelectedUser = createSelector(
  [getUser, getCurrentStaff], (user, currentStaff) => isEmpty(currentStaff) ? user : currentStaff
)
