import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { Switch, Route, Redirect, withRouter } from 'react-router-native'

import Header from '../shared/Header'
import Log from './Log'
import Contacts from './Contacts'
import TwoTabs from '../shared/TwoTabs'

const Phone = ({openDrawer, history}) => {
  const tab1Path = '/phone/home/log'
  const tab2Path = '/phone/home/contacts'
  return(
    <View style={styles.tabContainer}>
      <Header openDrawer={openDrawer} title="Calls" rightAction={() => history.push('/contact')} rightIcon='md-person-add'/>
      <TwoTabs tab1Path={tab1Path} tab2Path={tab2Path} tab1={'Log'} tab2={'Contacts'}/>
      <Switch>
        <Route exact path="/phone/home" render={() => <Redirect to={tab1Path}/>} />
        <Route path={tab1Path} component={Log} />
        <Route path={tab2Path} component={Contacts} />
      </Switch>
    </View>
  )
}

Phone.propTypes = {
  history: PropTypes.object.isRequired,
  openDrawer: PropTypes.func,
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1
  }
})

export default withRouter(Phone)
