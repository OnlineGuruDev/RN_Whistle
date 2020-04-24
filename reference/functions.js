import moment from 'moment'
import sort from 'ramda/src/sort'
import sortBy from 'ramda/src/sortBy'
import compose from 'ramda/src/compose'
import path from 'ramda/src/path'
import toLower from 'ramda/src/toLower'
import head from 'ramda/src/head'
import split from 'ramda/src/split'
import join from 'ramda/src/join'
import map from 'ramda/src/map'

export const orderByScheduleAtDesc = (a, b) => new Date(b.schedule_at).getTime() - new Date(a.schedule_at).getTime()

export const orderByScheduleAtAsc = (a, b) => new Date(a.schedule_at).getTime() - new Date(b.schedule_at).getTime()

const getLastName = path(['metadata', 'fields', 'last_name'])

export const getInitials = compose(join(''), map(head), split(' '))

export const displayDate = created => {
  const dateObj = moment(created)
  const now = moment()
  if (dateObj > now.endOf('day'))
    return dateObj.format('M/D/YY h:mm a')
  else if (dateObj > now.startOf('day'))
    return dateObj.format('h:mm a')
  else if (dateObj > now.subtract(7, 'days'))
    return dateObj.format('ddd')
  else
    return dateObj.format('M/D/YY')
}

export const isEmpty = obj => {
  let hasOwnProperty = Object.prototype.hasOwnProperty
  if (obj == null) return true
  if (obj.length > 0) return false
  if (obj.length === 0) return true
  if (typeof obj !== "object") return true
  for (let key in obj) {
    if (hasOwnProperty.call(obj, key)) return false
  }
  return true
}

export const isValid = (validator, state, setFunc) => {
  const { errors, isValid } = validator(state)
  if (!isValid) setFunc({errors})
  return isValid
}

export const formatDateWithTime = date => moment(date).format('ddd, MMM D h:mm A')

export const parseNameFromFields = contact => `${contact?.metadata?.fields?.first_name} ${contact?.metadata?.fields?.last_name}`
