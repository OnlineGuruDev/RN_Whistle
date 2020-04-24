import isEmpty from 'validator/lib/isEmpty'
import isMobilePhone from 'validator/lib/isMobilePhone'
import allPass from 'ramda/src/allPass'
import { isEmpty as empty } from '../reference/functions'

export default (data) => {
  let errors = {}
  const phone = `${data.fields.phone_number.replace(/[-(),#+ ]/g, '')}`

  if (isEmpty(data.fields.first_name)) {
    errors.first_name = 'First name required.'
  }

  if (isEmpty(data.fields.last_name)) {
    errors.last_name = 'Last name required.'
  }

  if (!isEmpty(phone) && !isMobilePhone(phone, 'en-US')) {
    errors.phone_number = 'Invalid format.'
  }

  if (isEmpty(phone) && isEmpty(data.fields.twitter_handle)) {
    errors.phone_number = 'Phone number or twitter handle required.'
    errors.twitter_handle = 'Twitter handle or phone number required.'
  }

  if (isEmpty(data.fields.year)) {
    errors.year = 'Year required.'
  }

  if (isEmpty(data.fields.position)) {
    errors.position = 'Position required.'
  }

  return {
    errors,
    isValid: empty(errors)
  }
}
