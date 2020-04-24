import isEmpty from 'validator/lib/isEmpty'
import isEmail from 'validator/lib/isEmail'
import isMobilePhone from 'validator/lib/isMobilePhone'
import { isEmpty as empty } from '../reference/functions'

export default (data) => {
  let errors = {}
  const phone = `${data.phone_number.replace(/[-(),#+ ]/g, '')}`

  if (isEmpty(data.name)) {
    errors.name = 'Name is required.'
  }

  if (isEmpty(data.name)) {
    errors.name = 'Name is required.'
  }

  if (!isEmail(data.email)) {
    errors.email = 'Email is invalid.'
  }

  if (isEmpty(data.email)) {
    errors.email = 'Email is required.'
  }

  if (!isMobilePhone(phone, 'en-US')) {
    errors.phone_number = 'Invalid format'
  }

  if (isEmpty(phone)) {
    errors.phone_number = 'Phone number required.'
  }

  return {
    errors,
    isValid: empty(errors)
  }
}
