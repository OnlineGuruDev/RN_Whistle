export const setFlash = (message, action = null, duration = 3000) => {
  return { type: 'SET_FLASH', message, action, duration }
}

export const setErrorFlash = res => dispatch => {
  if (res.response && res.response.data && res.response.data.message) {
    dispatch(setFlash(res.response.data.message))
  } else {
    dispatch(setFlash(res.message ? res.message : 'Whistle has encountered a problem.'))
  }
}

export const clearFlash = () => {
  return { type: 'CLEAR_FLASH' }
}
