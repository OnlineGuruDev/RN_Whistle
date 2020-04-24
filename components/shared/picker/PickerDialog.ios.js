import React from 'react'
import PropTypes from 'prop-types'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { View, Text, ActionSheetIOS, StyleSheet } from 'react-native'

import Touchable from '../Touchable'

const PickerDialog = ({value, onChange, options}) => {
  const showActionSheet = () => {
    // sheets need cancel button which will always be concatenated
    // at the end of the options array. therefore, options.length
    // will return the index of the cancel button
    ActionSheetIOS.showActionSheetWithOptions({
      options: options.map(o => o.label).concat(['Cancel']),
      cancelButtonIndex: options.length
    },
    (buttonIndex) => {
      if (buttonIndex !== options.length) {
        onChange(options[buttonIndex].label)
      }
    })
  }

  return (
    <Touchable onPress={showActionSheet}>
      <View style={styles.input}>
        <View>
          <Text>{value}</Text>
        </View>
        <View>
          <Icon name='ios-arrow-down' color='#98c950' size={28} />
        </View>
      </View>
    </Touchable>
  )
}

PickerDialog.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#ccc',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

export default PickerDialog
