import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect, Switch, withRouter } from 'react-router-native'
import Login from './Login'
import ForgotPassword from './ForgotPassword'

const UnauthRoutes = ({ location }) => {
  return (
    <Switch>
      <Route exact path='/login' component={Login} />
      <Route exact path='/forgot-password' component={ForgotPassword} />
      <Redirect push to='/login' />
    </Switch>
  )
}

UnauthRoutes.propTypes = {
  location: PropTypes.object.isRequired,
}

export default withRouter(UnauthRoutes)
