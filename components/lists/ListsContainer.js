import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-native'

import ListsHome from './ListsHome'
import ListContacts from './ListContacts'

const ListsContainer = ({openDrawer}) => {
  return (
    <Switch>
      <Route exact path='/lists' render={props => <ListsHome {...props} openDrawer={openDrawer} />} />
      <Route exact path='/lists/select/:listId' component={ListContacts} />
      <Route render={() => <Redirect to='/lists' />} />
    </Switch>
  )
}

ListsContainer.propTypes = {
  openDrawer: PropTypes.func
}

export default ListsContainer
