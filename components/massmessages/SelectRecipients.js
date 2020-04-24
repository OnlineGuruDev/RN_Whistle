import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Switch, Redirect, Route } from 'react-router-native'
import { Alert, View } from 'react-native'

import Header from '../shared/Header'
import ListIndex from './ListIndex'
import Contacts from './Contacts'
import TwoTabs from '../shared/TwoTabs'

const SelectRecipients = ({ history, recipients }) => {
  const confirmRecipients = () => {
    if (!recipients.length) return Alert.alert('You need to select recipient(s).')
    history.push('/messenger/new-mass-message')
  }

  const tab1Path = '/messenger/select-recipients/lists'
  const tab2Path = '/messenger/select-recipients/contacts'
  return (
    <View style={{ flex: 1 }}>
      <Header
        title='Select Recipients'
        backButton
        rightAction={confirmRecipients}
        rightIcon='md-checkmark'
      />
      <TwoTabs tab1Path={tab1Path} tab2Path={tab2Path} tab1={'Lists'} tab2={'Contacts'} />
      <Switch>
        <Route exact path='/messenger/select-recipients' render={() => <Redirect to={tab1Path} />} />
        <Route exact path={tab1Path} component={ListIndex} />
        <Route exact path={tab2Path} component={Contacts} />
      </Switch>
    </View>
  )
}

SelectRecipients.propTypes = {
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  currentStaff: PropTypes.object.isRequired,
  recipients: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
  currentStaff: state.currentStaff,
  recipients: state.massMessages.recipients
})

export default withRouter(connect(mapStateToProps)(SelectRecipients))
