import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, StyleSheet, FlatList, Alert, Platform } from 'react-native'
//import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'; 

import { COLORS, CONTACTS_GROUP } from '../../reference/constants'
//import * as Contacts from 'expo-contacts';

import { getListContacts } from '../../actions/lists'
import { getActiveList } from '../../selectors/listsSelectors'
import { getContactsPermission } from '../../utils/permissions'
import { getGroupId, createAddressBookContact } from '../../utils/addressBookFunctions'

import Loader from '../shared/Loader'
import Header from '../shared/Header'
import ListContactItem from './ListContactItem'

class ListContacts extends React.Component {
  state = {
    addingContacts: false
  }

  componentDidMount() {
    const { dispatch, staffId, match } = this.props
    dispatch(getListContacts(match.params.listId, staffId))
  }

  addContactsToAddressBook = async () => {
    try {
      // get Contacts permission
      const hasContactPermission = await getContactsPermission()
      if (!hasContactPermission) return Alert.alert('Canceled. Whistle needs access to Contacts.')

      // get groupId for group 'Whistle'
      const groupId = await getGroupId()
      if (!groupId) return Alert.alert('Canceled. Unable to create Whistle contacts group.')

      // start adding list of contacts
      this.setState({ addingContacts: true })
      var newContactsCount = 0
      for (let c of this.props.contacts) {
        // create new contact in phonebook
        const result = await createAddressBookContact(c, groupId)
        if (result) ++newContactsCount
      }
      this.setState({ addingContacts: false })
      Alert.alert(`${newContactsCount} new contacts added to address book.`)

    } catch(e) {
      console.log(e)
      Alert.alert('There was a problem adding the contacts.')
    }
  }

  addContactsAlert = () => Alert.alert(
    'Add Contacts to Phone',
    `Would you like to add these ${this.props.contacts.length} contacts to your phone's address book? This will allow you to identify incoming calls from these Whistle contacts.`,
    [
      {text: 'Add Contacts', onPress: () => this.addContactsToAddressBook()},
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
    ],
    { cancelable: true },
  )

  render() {
    const { contacts, isLoading, activeList } = this.props
    if (this.state.addingContacts) return <Loader/>
    return (
      <View style={styles.view}>
        <Header
          backButton={true}
          title={activeList.name || ""}
          rightAction={Platform.OS === 'ios' ? this.addContactsAlert : null}
          rightIconComponent={Platform.OS === 'ios' ? <Icon name={'address-card'} color={COLORS.WHITE} size={28} /> : null}
        />
        { isLoading
        ? <Loader/>
        : <FlatList
            keyboardShouldPersistTaps='handled'
            data={contacts}
            keyExtractor={item => `${item.id}`}
            renderItem={({item}) => <ListContactItem contact={item} />}
          /> }
      </View>
    )
  }
}

ListContacts.propTypes = {
  activeList: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  contacts: PropTypes.array.isRequired,
  staffId: PropTypes.number.isRequired,
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  }
})

const mapStateToProps = (state) => {
  return {
    contacts: state.lists.contacts,
    isLoading: state.lists.isLoading,
    staffId: state.currentStaff.id,
    activeList: getActiveList(state)
  }
}

export default connect(mapStateToProps)(ListContacts)
