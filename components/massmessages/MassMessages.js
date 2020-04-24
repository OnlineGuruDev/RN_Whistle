import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Alert, View, StyleSheet } from 'react-native'
import { withRouter, Switch, Redirect, Route } from 'react-router-native'

import { clearCurrentContact } from '../../actions/currentContact'
import { clearRecipients, clearPreview } from '../../actions/massMessages'

import Scheduled from './Scheduled'
import Sent from './Sent'
import TwoTabs from '../shared/TwoTabs'
import Header from '../shared/Header'

class MassMessages extends React.Component {

  newMassMessage = () => {
    const { history, clearRecipients, clearCurrentContact, currentStaff, clearPreview } = this.props
    if (currentStaff.id) {
      clearRecipients()
      clearCurrentContact()
      clearPreview()
      history.push('/messenger/select-recipients')
    } else {
      Alert.alert("You need to select a coach to create a message")
    }
  }

  render() {
    const tab1Path = '/messenger/home/scheduled'
    const tab2Path = '/messenger/home/sent'
    return (
      <View style={styles.view}>
        <Header
          openDrawer={this.props.openDrawer}
          title='Messenger'
          rightAction={this.newMassMessage}
          rightIcon='md-add'
        />
        <TwoTabs tab1Path={tab1Path} tab2Path={tab2Path} tab1={'Scheduled'} tab2={'Sent'} />
        <Switch>
          <Route exact path="/messenger/home" render={() => <Redirect to={tab1Path} />} />
          <Route path={tab1Path} component={Scheduled} />
          <Route path={tab2Path} component={Sent} />
        </Switch>
      </View>
    )
  }
}

MassMessages.propTypes = {
  currentStaff: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  openDrawer: PropTypes.func
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
})

const mapStateToProps = (state) => ({
  currentStaff: state.currentStaff
})

export default withRouter(connect(mapStateToProps, {
  clearRecipients,
  clearCurrentContact,
  clearPreview,
})(MassMessages))
