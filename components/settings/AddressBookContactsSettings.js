import React from 'react'
import { View, StyleSheet, Text, Alert } from 'react-native'
import { getContactsPermission } from '../../utils/permissions'
import { COLORS } from '../../reference/constants'
import {
  getGroupId,
  getAllContactInAddressBook,
  removeAddressBookContact,
} from '../../utils/addressBookFunctions'
import PrimaryButton from '../shared/PrimaryButton'

class AddressBookContactsSettings extends React.Component {
  state = {
    addressBookContacts: [],
    deleting: false,
  }

  async componentDidMount() {
    try {
      this._isMounted = true
      // get Contacts permission
      const hasContactPermission = await getContactsPermission()
      if (!hasContactPermission) return

      // get groupId for group 'Whistle'
      const groupId = await getGroupId()
      if (!groupId) return

      const contacts = await getAllContactInAddressBook(groupId)
      const contactIds = contacts.map(c => c.id)
      if (this._isMounted) this.setState({ addressBookContacts: contactIds })
    } catch (e) {
      Alert.alert('There was a problem getting address book information.')
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  deleteAddressBookContacts = async () => {
    this.setState({ deleting: true })
    for (let c of this.state.addressBookContacts) {
      await removeAddressBookContact(c)
    }
    this.setState({ deleting: false, addressBookContacts: [] })
    Alert.alert("All Whistle contacts removed from your phone's address book.")
  }

  deleteContactsPrompt = () => {
    Alert.alert(
      'Delete Phone Contacts',
      "Remove all Whistle contacts from your phone's address book?",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteAddressBookContacts() },
      ],
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Phone Address Book</Text>
        </View>
        <Text style={styles.contactsInfo}>{`Number of Whistle contacts: ${this.state.addressBookContacts.length}`}</Text>
        <PrimaryButton
          action={this.deleteContactsPrompt}
          text='Delete Phone Contacts'
          spinner={this.state.deleting}
          buttonStyle={styles.deleteButton}
          textStyle={styles.deleteButtonText}
          disabled={!this.state.addressBookContacts.length}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 15,
    // paddingBottom: 10,
    // marginBottom: 20,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY2,
  },
  header: {
    fontSize: 18,
    marginVertical: 3,
  },
  contactsInfo: {
    marginTop: 5,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: COLORS.ALERT_RED,
  },
  deleteButtonText: {
    color: COLORS.WHITE,
  },
})

export default AddressBookContactsSettings
