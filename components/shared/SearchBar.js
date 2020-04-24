import React from 'react'
import PropTypes from 'prop-types'
import { View, TextInput, StyleSheet } from 'react-native'
import { COLORS } from '../../reference/constants'

export default SearchBar = ({ search, defaultValue }) =>
  <View style={styles.searchView}>
    <TextInput
      defaultValue={defaultValue}
      style={styles.searchBar}
      onChangeText={v => search(v)}
      autoCorrect={false}
      underlineColorAndroid="transparent"
      placeholder='Search...'
    />
  </View>

SearchBar.propTypes = {
  defaultValue: PropTypes.string,
  search: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  searchView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 10,
    marginVertical: 7,
    height: 40,
    flexDirection: 'row'
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 9,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY
  }
})
