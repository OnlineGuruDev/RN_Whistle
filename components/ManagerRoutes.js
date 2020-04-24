import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Switch, Route, Redirect } from 'react-router-native'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import SideMenu from 'react-native-side-menu'

import { setCurrentStaff } from '../actions/currentStaff'

import FooterMenu from './FooterMenu'
import ListsContainer from './lists/ListsContainer'
import MessagesContainer from './messages/MessagesContainer'
import MassMessagesContainer from './massmessages/MassMessagesContainer'
import PhoneContainer from './calls/PhoneContainer'
import PushNotificationsManager from './PushNotificationsManager'
import Settings from './settings/Settings'
import SideBar from './SideBar'
import NewContact from './calls/NewContact'
import Profile from './profile/Profile'
import ProfileEdit from './profile/ProfileEdit'
import TermsAgreement from './shared/TermsAgreement'
class ManagerRoutes extends React.Component {
  state = { menu: false }
  // this causes wrong staff issue when opening app from push notification (which sets currentStaff to push notification staff)
  // componentDidMount() {
  //   if (this.props.user.kind === "manager") {
  //           SecureStorage.getItem('selected-coach', config)//SecureStore.getItemAsync('selected-coach')
  //       .then(id => id && this.props.setCurrentStaff(parseInt(id, 10)))
  //   }
  // }

  open = () => this.setState({ menu: true })

  close = () => this.setState({ menu: false })

  onChange = isOpen => {
    // onChnage handler sends close and open. we just want close
    // also on coach select we call close & this fires, so the prevState
    // thing should maybe prevent setting state 2x
    if (isOpen === false) {
      this.setState((prevState) => {
        if (prevState.menu) {
          return { menu: false }
        }
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <PushNotificationsManager />
        <TermsAgreement />
        <SideMenu
          disableGestures
          onChange={this.onChange}
          isOpen={this.state.menu}
          menu={<SideBar close={this.close} />}
        >
          <View style={styles.frontAppContainer}>
            <Switch>
              <Route path="/phone" render={props => <PhoneContainer {...props} openDrawer={this.open} />} />
              <Route path="/lists" render={props => <ListsContainer {...props} openDrawer={this.open} />} />
              <Route path="/messages" render={props => <MessagesContainer {...props} openDrawer={this.open} />} />
              <Route path='/messenger' render={props => <MassMessagesContainer {...props} openDrawer={this.open} />} />
              <Route path="/settings" component={Settings} />
              <Route path="/contact" component={NewContact} />
              <Route path="/profile/:contactId" component={Profile} />
              <Route path="/profile-edit/:contactId" component={ProfileEdit} />
              <Redirect to="/messages" />
            </Switch>
            <Switch>
              <Route path="/contact" />
              <Route path="/profile-edit/:contactId" />
              <Route component={FooterMenu} />
            </Switch>
          </View>
        </SideMenu>
      </View>
    )
  }
}

ManagerRoutes.propTypes = {
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
  frontAppContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },
})

const mapStateToProps = state => ({
  user: state.user,
})

export default withRouter(connect(mapStateToProps, {
  setCurrentStaff,
})(ManagerRoutes))
