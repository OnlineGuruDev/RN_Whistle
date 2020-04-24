import { createSelector } from 'reselect'
import map from 'ramda/src/map'
import path from 'ramda/src/path'
import curry from 'ramda/src/curry'
import sort from 'ramda/src/sort'
import sortBy from 'ramda/src/sortBy'
import groupWith from 'ramda/src/groupWith'
import compose from 'ramda/src/compose'
import reduce from 'ramda/src/reduce'
import reject from 'ramda/src/reject'
import prop from 'ramda/src/prop'
import propEq from 'ramda/src/propEq'

const getCoaches = state => state.user.coaches
const getActiveCoachId = (state, props) => props.match.params.coachId

export const getActiveCoach = createSelector(
  [getCoaches, getActiveCoachId],
  (coaches, activeCoachId) => coaches.find(c => c.id === Number(activeCoachId))
)

export const getWIDFields = state => state.wIDFields.fields
const getContactFields = state => state.currentContact.data?.metadata?.fields

const hydrateField = curry((rFs, sF) => ({ ...sF, value: path([sF.field], rFs) }))

const getSchoolContactFields = createSelector(
  [getWIDFields, getContactFields],
  (schoolFields, contactFields) => map(hydrateField(contactFields), schoolFields)
)

export const getContactFieldsObject = createSelector(
  [getSchoolContactFields], reduce((acc, cV) => ({ ...acc, [cV.field]: cV.value || '' }), {}))

export const getWIDFieldsNotPics = createSelector(
  [getWIDFields],
  compose(
    sortBy(prop('row_order')),
    reject(propEq('section', 'widpic')),
  )
)

export const getContactFieldsNoPics = createSelector(
  [getSchoolContactFields],
  compose(
    sortBy(prop('row_order')),
    reject(propEq('section', 'widpic')),
  )
)

export const getAthleticFields = createSelector(
  [getSchoolContactFields],
  schoolcontactFields => schoolcontactFields.filter(sRF => sRF.section === 'athletic')
)

export const getPersonalFields = createSelector(
  [getSchoolContactFields],
  schoolcontactFields => schoolcontactFields.filter(sRF => sRF.section === 'personal')
)

export const getScheduleFields = createSelector(
  [getSchoolContactFields],
  schoolcontactFields => schoolcontactFields.filter(sRF => sRF.section === 'schedule')
)

export const getOtherFields = createSelector(
  [getSchoolContactFields],
  schoolcontactFields => schoolcontactFields.filter(sRF => sRF.section === 'other')
)

export const getWidPicFields = createSelector(
  [getSchoolContactFields],
  schoolcontactFields => schoolcontactFields.filter(sRF => sRF.section === 'widpic')
)

export const getAthleticFieldsGroup = createSelector(
  [getWIDFields], wIDFields => wIDFields.filter(sRF => sRF.section === 'athletic')
)

export const getPersonalFieldsGroup = createSelector(
  [getWIDFields], wIDFields => wIDFields.filter(sRF => sRF.section === 'personal')
)

export const getScheduleFieldsGroup = createSelector(
  [getWIDFields], wIDFields => wIDFields.filter(sRF => sRF.section === 'schedule')
)

export const getOtherFieldsGroup = createSelector(
  [getWIDFields], wIDFields => wIDFields.filter(sRF => sRF.section === 'other')
)

export const getWIDPicFieldsGroup = createSelector(
  [getWIDFields], wIDFields => wIDFields.filter(sRF => sRF.section === 'widpic')
)

const getCurrentContact = state => state.currentContact
const getFieldValue = (state, props) => props.field.value

export const getWIDPic = createSelector(
  [getCurrentContact, getFieldValue],
  (contact, fieldValue) => contact.data.whistle_pics.find(pic => (pic.id === fieldValue) && !pic.removed)
)
