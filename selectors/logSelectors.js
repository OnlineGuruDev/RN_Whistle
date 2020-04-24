import { createSelector } from 'reselect'
import moment from 'moment'
import sortBy from 'ramda/src/sortBy'
import prop from 'ramda/src/prop'
import compose from 'ramda/src/compose'
import map from 'ramda/src/map'
import groupWith from 'ramda/src/groupWith'
import reverse from 'ramda/src/reverse'

const getCalls = state => state.voiceActivities.voiceActivities

const sortByCreated = sortBy(prop('created_at'))

const dayFormat = m => moment(m).format('dddd MMM Do, YYYY')

const sameDay = (a, b) => dayFormat(a.created_at) === dayFormat(b.created_at)

const toObjFormat = (callsGroup) => ({title: dayFormat(callsGroup[0].created_at), data: callsGroup
})

export const getCallLog = createSelector(
  [getCalls], compose(map(toObjFormat), groupWith(sameDay), reverse, sortByCreated)
)
