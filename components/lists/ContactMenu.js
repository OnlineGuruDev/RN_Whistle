import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { View, StyleSheet, Platform } from 'react-native'
//import { Ionicons, FontAwesome } from '@expo/vector-icons'
import FIcon from 'react-native-vector-icons/FontAwesome'; 
import Icon from 'react-native-vector-icons/Ionicons'; 

import { placeCall } from '../../actions/calls'
import { toggleFrozenListContact } from '../../actions/lists'
import { checkAndAddAddressBookContact } from '../../utils/addressBookFunctions'
import { COLORS } from '../../reference/constants'

import Touchable from '../shared/Touchable'
import { Phone, Messages } from '../../images/SVGImages'

const ContactMenu = ({ contact, dispatch, history, userKind }) => {

  const goToConversation = () => {
    history.push(`/messages/conversation/${contact.id}`)
  }

  const selectProfile = contact => {
    history.push(`/profile/${contact.id}`)
  }

  const callCheck = async () => {
    if (Platform.OS === 'ios' && contact.last_name !== "Unknown") {
      const c = {
        first_name: contact.first_name,
        last_name: contact.last_name,
        phone_number: contact.phone_number,
      }
      const result = await checkAndAddAddressBookContact(c)
    }
    dispatch(placeCall(contact))
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardItem}>
        <Touchable onPress={() => selectProfile(contact)}>
          <View style={styles.iconContainer}>
            <Icon size={30} style={styles.icon} name='ios-person' />
          </View>
        </Touchable>
      </View>
      <View style={styles.cardItem}>
        <Touchable onPress={() => dispatch(toggleFrozenListContact(contact.id))}>
          <View style={styles.iconContainer}>
            <FIcon size={30} style={contact.freezed ? styles.highlitedIcon : styles.icon} name='snowflake-o' />
          </View>
        </Touchable>
      </View>
      <View style={styles.cardItem}>
        { userKind === 'coach'
        ? <Touchable onPress={callCheck}>
            <View style={styles.iconContainer}>
              <Phone size={30} fill={COLORS.LIGHTER_GREEN} />
            </View>
          </Touchable>
        : <View style={styles.iconContainer}>
            <Phone size={30} fill={COLORS.GRAY} />
          </View> }
      </View>
      <View style={styles.cardItem}>
        <Touchable onPress={goToConversation}>
          <View style={styles.iconContainer}>
            <Messages size={30} fill={COLORS.LIGHTER_GREEN} />
          </View>
        </Touchable>
      </View>
    </View>
  )
}

ContactMenu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  contact: PropTypes.object.isRequired,
  userKind: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  highlitedIcon: {
    color: COLORS.BLUE,
    textAlign: 'center',
    width: 30,
    height: 30,
  },
  icon: {
    color: COLORS.LIGHTER_GREEN,
    textAlign: 'center',
    width: 30,
    height: 30,
  },
  font: {
    color: COLORS.BLACK
  },
  highlitedFont: {
    color: COLORS.DARKER_GRAY
  },
  card: {
    flex: 1,
    height: 60,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardItem: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainer: {
    flex: 1,
    // borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.WHITE,
    borderRadius: 25,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // added to fix iOS 12 onPress/svg issue, see https://github.com/react-native-community/react-native-svg/issues/794
    overflow: 'hidden',
  }
})

const mapStateToProps = state => {
  return {
    userKind: state.user.kind
  }
}

export default withRouter(connect(mapStateToProps)(ContactMenu))
