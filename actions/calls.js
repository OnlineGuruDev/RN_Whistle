import { BASE_URL } from '../reference/constants'
import axios from 'axios'
import { setErrorFlash } from './flash'
import { Linking, Alert } from 'react-native'

export const placeCall = contact => dispatch => {
  // [ [bool, message if not true], ... ]
  const conditions = [
    [contact.can_be_called, 'Contact has a countable call this week.'],
    [!contact.freezed, 'Contact is frozen.']
  ]
  if (conditions.every(i => i[0]))
    dispatch(_placeCall(contact.id))
  else
    Alert.alert(
      'Confirm.',
      conditions.filter(i => !i[0]).map(i => i[1]).join('\n'),
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Place call anyway', onPress: () => dispatch(_placeCall(contact.id))},
      ]
    )
}

const _placeCall = id => dispatch =>
  axios.post(BASE_URL + '/api/v1/calls/outgoing', { id })
    .then(res => {
      dispatch({ type: "PLACING_PHONE_CALL" })
      Linking.openURL('tel:' + res.data.phone)
    })
    .catch(err => {
      dispatch(setErrorFlash(err))
    })
