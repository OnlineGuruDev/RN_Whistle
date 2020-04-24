import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-native'
import MessagesHome from './MessagesHome'
import SelectContact from './SelectContact'
import Conversation from '../conversation/Conversation'


const MessagesContainer = ({ openDrawer }) => {
  return (
    <Switch>
      <Route exact path='/messages' render={() => <Redirect to='/messages/home' />} />
      <Route exact path='/messages/home' render={props => <MessagesHome {...props} openDrawer={openDrawer} />} />
      <Route exact path='/messages/select-contact' component={SelectContact} />
      <Route exact path='/messages/conversation/:contactId' component={Conversation} />
    </Switch>
  )
}

MessagesContainer.propTypes = {
  openDrawer: PropTypes.func
}

export default MessagesContainer
