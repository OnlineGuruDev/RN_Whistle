import { createSelector } from 'reselect'
import compose from 'ramda/src/compose'
import uniqBy from 'ramda/src/uniqBy'
import path from 'ramda/src/path'
import prop from 'ramda/src/prop'
import propOr from 'ramda/src/propOr'
import sortWith from 'ramda/src/sortWith'
import ascend from 'ramda/src/ascend'
import descend from 'ramda/src/descend'
import sort from 'ramda/src/sort'
import head from 'ramda/src/head'

const getActivities = state => state.activities.activities
const getConversation = state => state.conversation.conversation

export const getActivitiesOrdered = createSelector(
  [getActivities], compose(
                    uniqBy(path(['contact', 'id'])),
                    sortWith([
                      ascend(prop('is_read')),
                      descend(prop('created_at'))
                    ]))
)

export const getConversationOrdered = createSelector(
  [getConversation], compose(uniqBy(prop('id')), sort(descend(prop('created_at'))))
)

const checkVoice = message => (message && message.kind === 'voice') ? {...message, kind: 'message'} : message

export const getLastConvItemKind = createSelector(
  [getConversationOrdered], compose(propOr('message', 'kind'), checkVoice, head)
)
