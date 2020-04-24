import AsyncStorage from '@react-native-community/async-storage';

let HEADERS = ['access-token', 'token-type', 'client', 'expiry', 'uid']

const tokenMiddleware = args => store => next => action => {
  // if (!action)
  //   action = { type: '' }
  let { customHeaders = [], loggedInAction = 'LOGGED_IN', logoutAction = 'LOGGED_OUT', axios } = args
  HEADERS = [...HEADERS, ...customHeaders]
  if (action.type === loggedInAction) {
    let { headers } = action
    if (!headers) console.error('loggedInAction must contain headers!')
    HEADERS.forEach(header => {
      axios.defaults.headers.common[header] = headers[header]
    })
  } else if (action.type === logoutAction) {
    HEADERS.forEach(async (token) => {
      await AsyncStorage.removeItem(token)//,config) //await SecureStore.deleteItemAsync(token)
    })
  } else {
    let { headers } = action
    if (headers) {
      if (headers['access-token']) {
        HEADERS.forEach(async (token) => {
          axios.defaults.headers.common[token] = headers[token]
          await AsyncStorage.setItem(token, headers[token])//, config)//SecureStore.setItemAsync(token, headers[token])
        })
      }
    }
  }
  return next(action)
}

export default tokenMiddleware
