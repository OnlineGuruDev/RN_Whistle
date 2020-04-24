import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'

import Lists from './Lists'
import Header from '../shared/Header'

const ListsHome = ({openDrawer}) => {
  return (
    <View style={styles.view}>
      <Header title='Lists' openDrawer={openDrawer} />
      <Lists />
    </View>
  )
}

ListsHome.propTypes = {
  openDrawer: PropTypes.func,
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
})

export default ListsHome
