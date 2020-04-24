import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'
import { StyleSheet, View, Alert } from 'react-native'
import Header from '../shared/Header'
import Messages from './Messages'

//import * as Contacts from 'expo-contacts';

const MessagesHome = ({ openDrawer, history, currentStaff }) => {
  const CONTACTS_GROUP = "Whistle"

  const goToNewMessage = () => {
    if (currentStaff.id)
      history.push('/messages/select-contact')
    else
      Alert.alert('You need to select a coach to send a message')
  }

  return (
    <View style={styles.messagesContainer}>
      <Header
        openDrawer={openDrawer}
        title='Messages'
        rightAction={goToNewMessage}
        rightIcon='md-add'
      />
      <Messages />
    </View>
  )
}

MessagesHome.propTypes = {
  history: PropTypes.object.isRequired,
  currentStaff: PropTypes.object.isRequired,
  openDrawer: PropTypes.func,
}

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1
  }
})

const mapStateToProps = (state) => {
  return {
    currentStaff: state.currentStaff
  }
}

export default withRouter(connect(mapStateToProps)(MessagesHome))
