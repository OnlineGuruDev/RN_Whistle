import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'
//import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'; 

import { Alert, View, StyleSheet, Platform } from 'react-native'

import { placeCall } from '../../actions/calls'
import { toggleFrozenCurrentContact } from '../../actions/currentContact'

import Touchable from '../shared/Touchable'
import ContactAddressBookButton from './ContactAddressBookButton'
import { ContactAvatar } from '../shared/AvatarBubbles'

import { COLORS } from '../../reference/constants'
import { Phone, Messages } from '../../images/SVGImages'

import { checkAndAddAddressBookContact } from '../../utils/addressBookFunctions'

const ProfileButtons = ({
  toggleFrozenCurrentContact,
  history,
  currentStaff,
  userKind,
  contact,
  placeCall,
}) => {
  const toConversation = () => !currentStaff.id
    ? Alert.alert('Select a coach')
    : history.push(`/messages/conversation/${contact.id}`)

  const callCheck = async contact => {
    // if on ios and contact is not 'Unknown', add contact to address book
    if (Platform.OS === 'ios' && contact.metadata?.fields?.last_name !== 'Unknown') {
      const c = {
        first_name: contact.metadata.fields.first_name,
        last_name: contact.metadata.fields.last_name,
        phone_number: contact.phone_number_normalized,
      }
      await checkAndAddAddressBookContact(c)
    }
    placeCall(contact)
  }

  return (
    <View style={styles.header}>
      <View style={styles.sideContainer}>
        <View style={styles.iconContainer}>
          <Touchable noBorderless style={styles.sideButton} onPress={() => toggleFrozenCurrentContact(contact.id, !contact.freezed)}>
            <View style={[styles.sideButton, styles.iconContainer]}>
              <Icon style={contact.freezed ? styles.highlitedIcon : styles.icon} name='snowflake-o' />
            </View>
          </Touchable>
        </View>
        {Platform.OS === 'ios' && userKind === 'coach'
          ? (
            <ContactAddressBookButton
              contact={contact}
              addContactAlert={this.addContactAlert}
            />
          )
          : null
        }
      </View>
      <View style={styles.avatarButton}>
        <ContactAvatar large size={60} contact={contact} />
      </View>
      <View style={styles.sideContainer}>
        {userKind === 'coach'
          ? (
            <View style={styles.iconContainer}>
              <Touchable noBorderless style={styles.sideButton} onPress={() => callCheck(contact)}>
                <View style={[styles.sideButton, styles.iconContainer]}>
                  <Phone size={30} fill={COLORS.LIGHTER_GREEN} />
                </View>
              </Touchable>
            </View>
          )
          : (
            <View style={[styles.sideButton, styles.iconContainer]}>
              <Phone size={30} fill={COLORS.LIGHTER_GRAY} />
            </View>
          )
        }
        <View style={styles.iconContainer}>
          <Touchable noBorderless style={styles.sideButton} onPress={toConversation}>
            <View style={[styles.sideButton, styles.iconContainer]}>
              <Messages fill={COLORS.LIGHTER_GREEN} size={30} />
            </View>
          </Touchable>
        </View>
      </View>
    </View>
  )
}

ProfileButtons.propTypes = {
  toggleFrozenCurrentContact: PropTypes.func.isRequired,
  placeCall: PropTypes.func.isRequired,
  currentStaff: PropTypes.object.isRequired,
  contact: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  userKind: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
  avatarButton: {
    height: 63,
    width: 63,
    flexBasis: 63,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 5,
  },
  highlitedIcon: {
    color: COLORS.BLUE,
    fontSize: 30,
  },
  icon: {
    fontSize: 30,
    color: COLORS.LIGHTER_GREEN,
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
  sideContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
})

const mapStateToProps = state => {
  return {
    currentStaff: state.currentStaff,
    contact: state.currentContact.data,
    userKind: state.user.kind,
  }
}

export default withRouter(connect(mapStateToProps, { toggleFrozenCurrentContact, placeCall })(ProfileButtons))
