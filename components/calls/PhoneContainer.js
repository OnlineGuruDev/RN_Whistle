import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-native'

import Phone from './Phone'

const PhoneContainer = ({openDrawer}) => {
  return (
    <Switch>
      <Route exact path='/phone' render={() => <Redirect to='/phone/home' />} />
      <Route path='/phone/home' render={props => <Phone {...props} openDrawer={openDrawer} />} />
    </Switch>
  )
}

PhoneContainer.propTypes = {
  openDrawer: PropTypes.func
}

export default PhoneContainer
