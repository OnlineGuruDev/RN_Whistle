import React from 'react'
import { Alert, View, StyleSheet } from 'react-native'
//import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'; 

import Touchable from '../shared/Touchable'

import { getContactsPermission } from '../../utils/permissions'
import {
  getGroupId,
  createAddressBookContact,
  removeAddressBookContact,
  findContactsInAddressBook,
} from '../../utils/addressBookFunctions'
import { parseNameFromFields } from '../../reference/functions'

import { COLORS } from '../../reference/constants'

class ContactAddressBookButton extends React.Component {
  state = {
    loaded: false,
    inAddressBook: false,
    groupId: '',
    contactAddressId: '',
  }

  async componentDidMount() {
    const hasContactPermission = await getContactsPermission()
    if (!hasContactPermission) return
    const groupId = await getGroupId()
    const result = await findContactsInAddressBook({
      name: parseNameFromFields(this.props.contact),
      groupId
    })
    this.setState({
      loaded: true,
      inAddressBook: !!result.length,
      groupId,
      contactAddressId: result[0]?.id || ''
    })
  }

  addContactToAddressBook = async () => {
    try {
      const contact = {
        first_name: this.props.contact.metadata.fields.first_name,
        last_name: this.props.contact.metadata.fields.last_name,
        phone_number: this.props.contact.phone_number_normalized,
      }
      const newContactId = await createAddressBookContact(contact, this.state.groupId)

      if (newContactId) {
        Alert.alert(`Contact added to address book.`)
        this.setState({ inAddressBook: true, contactAddressId: newContactId })
      } else {
        Alert.alert('Contact was not added to address book.')
      }
    } catch (e) {
      console.log(e)
      Alert.alert('There was a problem adding the contact.')
    }
  }

  removeContactFromAddressBook = async () => {
    try {
      await removeAddressBookContact(this.state.contactAddressId)

      Alert.alert(`Contact removed from address book.`)
      this.setState({ inAddressBook: false, contactAddressId: '' })

    } catch(e) {
      console.log(e)
      Alert.alert('There was a problem removing the contact.')
    }
  }

  addContactAlert = () => Alert.alert(
    'Add Contact to Phone',
    `Add ${parseNameFromFields(this.props.contact)} to your phone's address book? This will allow you to identify him/her in incoming calls.`,
    [
      {text: 'Add Contact', onPress: () => this.addContactToAddressBook()},
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
    ],
    { cancelable: true },
  )

  removeContactAlert = () => Alert.alert(
    'Remove Contact from Phone',
    `Remove ${parseNameFromFields(this.props.contact)} from your phone's address book?`,
    [
      {text: 'Remove Contact', onPress: () => this.removeContactFromAddressBook()},
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
    ],
    { cancelable: true },
  )

  render() {
    return (
      <View style={styles.iconContainer}>
        <Touchable noBorderless style={styles.sideButton} onPress={this.state.inAddressBook ? this.removeContactAlert : this.addContactAlert}>
          <View style={[styles.sideButton, styles.iconContainer]}>
            {this.state.loaded
              ? <Icon style={this.state.inAddressBook ? styles.highlitedIcon : styles.icon} name='address-card-o'/>
              : null
            }
          </View>
        </Touchable>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  highlitedIcon: {
    color: COLORS.BLUE,
    fontSize: 28
  },
  icon: {
    fontSize: 28,
    color: COLORS.LIGHT_GRAY,
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.WHITE,
  },
  sideButton: {
    height: 50,
    width: 50,
    // added to fix iOS 12 onPress/svg issue, see https://github.com/react-native-community/react-native-svg/issues/794
    overflow: 'hidden',
  },
})

export default ContactAddressBookButton
