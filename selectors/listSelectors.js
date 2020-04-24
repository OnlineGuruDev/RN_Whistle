import { createSelector } from 'reselect'
import compose from 'ramda/src/compose'
import prop from 'ramda/src/prop'
import toLower from 'ramda/src/toLower'
import sortBy from 'ramda/src/sortBy'

const getLists = state => state.lists.lists

export const formattedLists = createSelector(
  [getLists], sortBy(compose(toLower, prop('name')))
)
