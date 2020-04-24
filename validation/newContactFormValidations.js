import isEmpty from 'validator/lib/isEmpty'
import isMobilePhone from 'validator/lib/isMobilePhone'
import { isEmpty as empty } from '../reference/functions'

export default (data) => {
  let errors = {}
  const phone = `${data.phone_number.replace(/[-(),#+ ]/g, '')}`

  if (isEmpty(data.first_name)) {
    errors.first_name = 'First name required.'
  }

  if (isEmpty(data.last_name)) {
    errors.last_name = 'Last name required.'
  }

  if (!isMobilePhone(phone, 'en-US')) {
    errors.phone_number = 'Invalid format.'
  }

  if (isEmpty(phone)) {
    errors.phone_number = 'Phone number required.'
  }

  if (isEmpty(data.year)) {
    errors.year = 'Year required.'
  }

  if (isEmpty(data.position)) {
    errors.position = 'Position required.'
  }
  
  return {
    errors,
    isValid: empty(errors)
  }
}
