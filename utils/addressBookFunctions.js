import * as Contacts from 'expo-contacts'
// import Contacts from 'react-native-unified-contacts';

import { Alert } from 'react-native'
import { CONTACTS_GROUP } from '../reference/constants'
import { getContactsPermission } from './permissions'

export const getGroupId = async () => {
   
  try {
  const whistleGroup = await Contacts.getGroupsAsync({ groupName: CONTACTS_GROUP })
  return whistleGroup.length
    ? whistleGroup[0].id
    : await Contacts.createGroupAsync(CONTACTS_GROUP)
  } 
  catch (e) {
    console.log(e)
    return false
  }
}

export const findContactsInAddressBook = async ({ name, groupId }) => {
  const { data } = await Contacts.getContactsAsync({ name, groupId })
  return data
}

export const getAllContactInAddressBook = async groupId => {
  const { data } = await Contacts.getContactsAsync({ groupId, fields: ['id'] })
  return data
}

export const createAddressBookContact = async (contact, groupId) => {
  // search for existing contact
  const result = await findContactsInAddressBook({
    name: `${contact.first_name} ${contact.last_name}`,
    groupId,
  })
  // check that search was successful, no address book contact was found,
  // and the new contact has a phone_number
  if (Array.isArray(result) && !result.length && contact.phone_number) {
    // create contact object
    const newContact = {
      firstName: contact.first_name,
      lastName: contact.last_name,
      phoneNumbers: [{ number: contact.phone_number.replace(/\D/g, '') }],
    }
    // create new contact in address book
    const contactId = await Contacts.addContactAsync(newContact)
    // add new contact to whistle group
    await Contacts.addExistingContactToGroupAsync(contactId, groupId)
    return contactId
  }
  return false
}

export const removeAddressBookContact = (contactAddressId) => Contacts.removeContactAsync(contactAddressId)

export const checkAndAddAddressBookContact = async contact => {
  // sample contact
  // const contact = {
  //   first_name: 'Johnny',
  //   last_name: 'Bluechip',
  //   phone_number: '+6078989898', //number will be sanitized by createAddress.. function
  // }

  try {
    // get Contacts permission
    const hasContactPermission = await getContactsPermission()
    if (!hasContactPermission) return // Alert.alert('Canceled. Whistle needs access to Contacts.')

    // get groupId for group 'Whistle'
    const groupId = await getGroupId()
    if (!groupId) return Alert.alert('Canceled. Unable to create Whistle contacts group.')

    return await createAddressBookContact(contact, groupId)
  } catch (e) {
    console.log(e)
  }
}
