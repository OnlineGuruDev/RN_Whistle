import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, StyleSheet } from 'react-native'
import PickerDialog from './PickerDialog'

export default Picker = ({error = null, required = false, value, onChange, options, label}) =>
  <View style={styles.view}>
    <Text>{required && '*'}{label}</Text>
    <PickerDialog
      value={value}
      onChange={onChange}
      options={options}
      label={label}
    />
    { error && <Text style={styles.error}>{error}</Text> }
  </View>

Picker.propTypes = {
  error: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
  view: {
    marginBottom: 5,
    paddingBottom: 15
  },
  error: {
    color: 'red',
    fontSize: 12,
    position: 'absolute',
    bottom: 0,
    left: 0
  }
})
