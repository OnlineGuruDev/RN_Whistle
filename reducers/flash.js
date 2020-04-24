const flash = (state = {}, action) => {
  switch (action.type) {
    case 'SET_FLASH':
      return { message: action.message, action: action.action, duration: action.duration }
    case 'CLEAR_FLASH':
      return {}
    default:
      return state
  }
}

export default flash
