import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-native'

import MassMessages from './MassMessages'
import NewMassMessage from './NewMassMessage'
import SentDetails from './SentDetails'
import PreviewEditContainer from './PreviewEditContainer'
import SelectRecipients from './SelectRecipients'

const MassMessagesContainer = ({ openDrawer }) => {
  return (
    <Switch>
      <Route exact path='/messenger' render={() => <Redirect to='/messenger/home' />} />
      <Route path='/messenger/home' render={props => <MassMessages {...props} openDrawer={openDrawer} />} />
      <Route path='/messenger/new-mass-message' component={NewMassMessage} />
      <Route path='/messenger/details/:id' component={SentDetails} />
      <Route path='/messenger/preview-edit' component={PreviewEditContainer} />
      <Route path='/messenger/select-recipients' component={SelectRecipients} />
    </Switch>
  )
}

MassMessagesContainer.propTypes = {
  openDrawer: PropTypes.func,
}

export default MassMessagesContainer
