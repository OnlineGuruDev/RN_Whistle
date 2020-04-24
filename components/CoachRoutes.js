import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Switch, Route, Redirect } from 'react-router-native'
import { View, StyleSheet } from 'react-native'

import FooterMenu from './FooterMenu'
import ListsContainer from './lists/ListsContainer'
import MessagesContainer from './messages/MessagesContainer'
import MassMessagesContainer from './massmessages/MassMessagesContainer'
import PhoneContainer from './calls/PhoneContainer'
import PushNotifications from './PushNotifications'
import Settings from './settings/Settings'
import NewContact from './calls/NewContact'
import Profile from './profile/Profile'
import ProfileEdit from './profile/ProfileEdit'
import PushList from './PushList'
import TermsAgreement from './shared/TermsAgreement'

class CoachRoutes extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <PushNotifications/>
        <TermsAgreement/>
        <Switch>
          <Route path="/phone" component={PhoneContainer}/>
          <Route path="/lists" component={ListsContainer}/>
          <Route path="/messages" component={MessagesContainer}/>
          <Route path="/messenger" component={MassMessagesContainer}/>
          <Route path="/settings" component={Settings} />
          <Route path="/contact" component={NewContact} />
          <Route path="/profile/:contactId" component={Profile} />
          <Route path="/profile-edit/:contactId" component={ProfileEdit} />
          <Route path="/pushlist/:id" component={PushList} />

          <Redirect to="/messages"/>
        </Switch>
        <Switch>
          <Route path="/contact" />
          <Route path="/profile-edit" />
          <Route component={FooterMenu}/>
        </Switch>
      </View>
    )
  }
}

CoachRoutes.propTypes = {
  location: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
})

export default withRouter(CoachRoutes)
