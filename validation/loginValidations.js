import isEmpty from 'validator/lib/isEmpty'
import isEmail from 'validator/lib/isEmail'
import { isEmpty as empty } from '../reference/functions'

export default (data) => {
  let errors = {}

  if (!isEmail(data.email)) {
    errors.email = 'Email is invalid.'
  }

  if (isEmpty(data.email)) {
    errors.email = 'Email is required.'
  }

  if (isEmpty(data.password)) {
    errors.password = 'Password is required.'
  }

  return {
    errors,
    isValid: empty(errors)
  }
}
