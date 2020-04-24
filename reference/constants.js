//import { TEST_BASE_URL } from './variables'
//import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'
export const BASE_URL = "https://app.whistlerecruiting.com" //"https://devapp.whistlerecruiting.com"//"http://localhost:3000" //process.env.NODE_ENV === 'development' ? TEST_BASE_URL : "https://app.whistlerecruiting.com"
export const CONTACTS_GROUP = "Whistle"

export const COLORS = {
  BLACK: '#000',
  WHITE: '#fff',
  OFF_WHITE: '#f6f6f6',
  LIGHTEST_GRAY: '#e8ece7',
  LIGHTER_GRAY: '#ddd',
  LIGHT_GRAY2: '#ccc',
  LIGHT_GRAY: '#bbb',
  GRAY: '#777',
  DARK_GRAY: '#555',
  DARKER_GRAY: '#333',
  DARKEST_GRAY: '#212121',
  LIGHTEST_GREEN: '#caeab5',
  LIGHTER_GREEN: '#98c950',
  LIGHT_GREEN: '#73bd32',
  ADD_GREEN: '#53932e',
  NAV_GREEN: '#509a3c',
  BTN_GREEN: '#5cb85c',
  DARK_GREEN: '#2E6633',
  LIGHT_ORANGE: '#ffdb99',
  WARNING_ORANGE: '#ffa500',
  WARNING_YELLOW: '#ffeb3b',
  ALERT_RED: '#d9534f',
  LIGHT_ALERT_RED: 'rgba(228, 71, 60, 0.44)',
  LIGHT_BLUE: '#a5f2f3',
  BLUE: '#257ca3',
  MODAL_OVERLAY: 'rgba(0,0,0, 0.6)',
  FLASH_BACKGROUND: 'rgba(0,0,0, 0.85)',
  BOX_SHADOW: 'rgba(0,0,0, .075)',
  TWITTER_LIGHT: '#68b3f9', //'#1DA1F2',
  IMESSAGE_LIGHT: '#3377e3', //'#F442EB',
}

export const ICONS = {
  sport: {
    'ios': 'ios-american-football',
    'android': 'md-american-football'
  },
  rank: {
    'ios': 'ios-list',
    'android': 'md-list'
  },
  coach: {
    'ios': 'ios-document',
    'android': 'md-document'
  },
  position: {
    'ios': 'ios-star',
    'android': 'md-star'
  },
  institute: {
    'ios': 'ios-bus',
    'android': 'md-bus'
  },
  year: {
    'ios': 'ios-school',
    'android': 'md-school'
  },
  first_name: {
    'ios': 'ios-person',
    'android': 'md-person'
  },
  last_name: {
    'ios': 'ios-person',
    'android': 'md-person'
  },
  phone_number: {
    'ios': 'ios-call',
    'android': 'md-call'
  },
  email: {
    'ios': 'ios-mail',
    'android': 'md-mail'
  },
  twitter_handle: {
    'ios': 'logo-twitter',
    'android': 'logo-twitter'
  },
  birthdate: {
    'ios': 'ios-calendar',
    'android': 'md-calendar'
  },
  mother_name: {
    'ios': 'ios-woman',
    'android': 'md-woman'
  },
  father_name: {
    'ios': 'ios-man',
    'android': 'md-man'
  },
  city: {
    'ios': 'ios-navigate',
    'android': 'md-navigate'
  },
  state: {
    'ios': 'ios-map',
    'android': 'md-map'
  },
  schedule: {
    'ios': 'ios-pin',
    'android': 'md-pin'
  },
  default: {
    'ios': 'ios-person',
    'android': 'md-person'
  }
}

// export const config = {
//   accessControl: ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
//   accessible: ACCESSIBLE.WHEN_UNLOCKED,
//   accessGroup: null,
//   authenticationPrompt: 'whistlenative',
//   service: 'Whistle',
//   authenticateType: AUTHENTICATION_TYPE.BIOMETRICS,
// }

