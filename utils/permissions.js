//import * as Permissions from 'expo-permissions'
import {request, PERMISSIONS} from 'react-native-permissions';


export const getContactsPermission = async () => {
 
  const permission = await request(PERMISSIONS.IOS.CONTACTS);

  if (permission === 'granted') {
    return true
  } else {
    return false
  }
  // const { status: existingStatus } = await Permissions.getAsync(
  //   Permissions.CONTACTS
  // )
  // if (existingStatus !== 'granted') {
  //   const { status } = await Permissions.askAsync(Permissions.CONTACTS)
  //   if (status !== 'granted') return false
  //   return true
  // }
  return false
}
