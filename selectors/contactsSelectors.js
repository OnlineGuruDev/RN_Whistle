import {createSelector} from 'reselect'
import reduceBy from 'ramda/src/reduceBy'
import head from 'ramda/src/head'
import map from 'ramda/src/map'
import zipObj from 'ramda/src/zipObj'
import compose from 'ramda/src/compose'
import toPairs from 'ramda/src/toPairs'

const getAllContacts = state => state.contacts.contacts

const groupContactsBy = reduceBy((acc, contact) => [...acc, contact], [])
const contactsByName = groupContactsBy(contact => head(contact.last_name).toUpperCase())
const groupedContacts = compose(map(zipObj(['title', 'data'])), toPairs, contactsByName)

export const formattedContacts = createSelector([getAllContacts], groupedContacts)
