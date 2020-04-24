import { BASE_URL } from '../reference/constants'
import {
  LOGGED_IN,
  LOGGED_OUT,
  FETCHING_AUTH,
  FETCHING_AUTH_COMPLETE,
  RECEIVE_CALL_TAGS,
  RECEIVE_ONBEHALF,
  USER_INFO_UPDATED,
  SET_CURRENT_STAFF,
  TOKEN_CHECK_COMPLETE,
  USER_INFO_SUBMITTING,
  UPDATE_TERMS_AGREEMENT,
} from '../actions/types'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';

import { setFlash, setErrorFlash } from './flash'

import { loadWIDFields } from './wIDFields'

export const fetchingAuth = () => dispatch => dispatch({ type: FETCHING_AUTH })

export const fetchAuthComplete = () => dispatch => dispatch({ type: FETCHING_AUTH_COMPLETE })

export const checkTokenComplete = () => dispatch => dispatch({ type: TOKEN_CHECK_COMPLETE })

const loggedIn = (data, headers) => async dispatch => {

  await AsyncStorage.setItem('uid', headers['uid'])
  await AsyncStorage.setItem('client', headers['client'])
  await AsyncStorage.setItem('access-token', headers['access-token'])
  await AsyncStorage.setItem('token-type', headers['token-type'])
  await AsyncStorage.setItem('expiry', headers['expiry'])

  dispatch({ type: LOGGED_IN, data, headers })
}

export const auth = (email, password, history) => dispatch => {
  console.log('==========auth====================');
  dispatch(fetchingAuth())
  return axios.post(BASE_URL + '/api/v1/auth/sign_in', { email, password, mobile: true })
    .then(async ({ data, headers }) => {
      if (data.data.kind === 'coach') {
        dispatch({ type: SET_CURRENT_STAFF, staff: data.data })
      }
      await dispatch(loggedIn(data, headers))
      return { ok: true }
    })
    .catch(err => {
      console.log('auth error', err);
      if (!err || !err.response) {
        return;
      }
      dispatch(fetchAuthComplete())
      if (err.response.status === 401) {
        dispatch(setFlash(err.response.data.errors[0]))
      } else if (err.response.status === 403) {
        dispatch(setFlash('Account deactivated. Contact Support.'))
      } else {
        dispatch(setFlash('There was a problem connecting to Whistle.'))
      }
      return { ok: false }
    })
}

export const validateAuth = token => async dispatch => {
  console.log('==========validateAuth====================');

  dispatch(fetchingAuth())
  let data = {
    mobile: true,
    uid: await AsyncStorage.getItem('uid'), //config),//await SecureStore.getItemAsync('uid'),
    client: await AsyncStorage.getItem('client'), //config),//await SecureStore.getItemAsync('client'),
    'access-token': await AsyncStorage.getItem('access-token'), //config),//await SecureStore.getItemAsync('access-token'),
    'token-type': await AsyncStorage.getItem('token-type'), //config),//await SecureStore.getItemAsync('token-type'),
    expiry: await AsyncStorage.getItem('expiry'), //config),//await SecureStore.getItemAsync('expiry'),
  }

  console.log(data);

  return axios.get(`${BASE_URL}/api/v1/auth/validate_token`, { params: data })
    .then(async ({ data, headers }) => {
      if (data.data.kind === 'coach') {
        dispatch({ type: SET_CURRENT_STAFF, staff: data.data })
      }
      await dispatch(loggedIn(data, headers))
      dispatch(loadWIDFields())
    })
    .catch(err => {
      console.log(err.response)
      dispatch(fetchAuthComplete())
      if (err.response.status === 401) {
        dispatch(setFlash(err.response.data.errors[0]))
      } else if (err.response.status === 403) {
        dispatch(setFlash('Account deactivated. Contact Support.'))
      } else {
        dispatch(setFlash('There was a problem connecting to Whistle.'))
      }
    })
}

export const loadCallTags = () => dispatch =>
  axios.get(BASE_URL + '/api/v1/calls/available_call_tags')
    .then(res => dispatch({ type: RECEIVE_CALL_TAGS, tags: res.data }))
    .catch(err => console.error(err))

export const loadOnBehalf = () => dispatch =>
  axios.get(BASE_URL + '/api/v1/staffs/on_behalf_users')
    .then(({ data }) => dispatch({ type: RECEIVE_ONBEHALF, data: data.coaches }))
    .catch(err => console.error(err))

export const updateUserData = user_data => dispatch => {
  dispatch({ type: USER_INFO_SUBMITTING, data: true })
  axios.put(BASE_URL + `/api/v1/staffs/${user_data.id}`, {
    name: user_data.name,
    title: user_data.title,
    phone_number: user_data.phone_number,
    email: user_data.email,
    twitter_handle: user_data.twitter_handle,
  })
    .then(res => {
      dispatch({ type: USER_INFO_UPDATED, data: res.data })
      dispatch({ type: USER_INFO_SUBMITTING, data: false })
      dispatch(setFlash('Success, your information was updated.'))
    })
    .catch(err => {
      dispatch({ type: USER_INFO_SUBMITTING, data: false })
      dispatch(setErrorFlash(err))
    })
}

const handleLogout = () => dispatch =>
  axios.delete(`${BASE_URL}/api/v1/auth/sign_out`)
    .then(res => {
      dispatch({ type: LOGGED_OUT })
      dispatch(setFlash('Logged out successfully!'))
    })
    .catch(res => {
      dispatch({ type: LOGGED_OUT })
      if (res.response && res.response.statusText) {
        dispatch(setErrorFlash(res))
      } else {
        dispatch(setFlash('There was a problem connecting to whistle, please contact support.'))
      }
    })

const clearPushToken = () => {
  axios.delete(`${BASE_URL}/api/v1/staffs/clear_push_token`)
}

export const logout = () => async dispatch => {
  try {
    await clearPushToken()

    //clear all keys except
    console.log('************ clear keys ****************');
    const keys = await AsyncStorage.getAllKeys();
    AsyncStorage.multiRemove(keys);
    // const buildKeys = keys.filter(key => {
    //   return key.indexOf('build') === -1;
    // });
    //await AsyncStorage.multiRemove(buildKeys);
    await dispatch(handleLogout())
  } catch (err) {
    dispatch(setFlash('There was a problem logging out.'))
  }
}

export const updateTermsAgreement = coachId => dispatch =>
  axios.put(`${BASE_URL}/api/v2/staffs/update_terms_agreement`, { headers: { onbehalf: coachId } })
    .then(() => {
      dispatch({ type: UPDATE_TERMS_AGREEMENT })
      return { ok: true }
    })
    .catch(response => {
      dispatch(setErrorFlash(response))
      return { ok: false }
    })
