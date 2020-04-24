import { BASE_URL } from '../reference/constants'
import {
  RECEIVE_WID_FIELDS
} from '../actions/types'
import axios from 'axios'
import { setErrorFlash } from './flash'

export const loadWIDFields = () => dispatch =>
  axios.get(BASE_URL + '/api/v2/whistleids')
    .then(res => dispatch({ type: RECEIVE_WID_FIELDS, field_names: res.data }))
    .catch(res => dispatch(setErrorFlash(res)))
