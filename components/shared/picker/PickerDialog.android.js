import React from 'react'
import PropTypes from 'prop-types'
import { View, Picker, StyleSheet } from 'react-native'

const PickerDialog = ({value, onChange, options, label}) => {
  const renderPickerOptions = options =>
    options.map(o => <Picker.Item key={o.label} label={o.label} value={o.label} />)

  return (
    <View style={styles.input}>
      <Picker
        style={styles.input}
        selectedValue={value}
        onValueChange={value => value && onChange(value)}>
        <Picker.Item style={{color: "red"}} label={`Select ${label}...`} value={''} />
        {renderPickerOptions(options)}
      </Picker>
    </View>
  )
}

PickerDialog.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderColor: '#ccc',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
  }
})

export default PickerDialog
