import React from 'react'
import PropTypes from 'prop-types'
import { TextInput, Text, StyleSheet, View } from 'react-native'

const PrimaryInput = ({
  autoCapitalize = 'none',
  autoCorrect = false,
  autoFocus = false,
  error = null,
  keyboardType = 'default',
  label,
  onChangeText,
  required,
  secureTextEntry = false,
  value,
  editable=true,
  textContentType=null,
}) =>
  <View style={styles.container}>
    <Text>{required && '*'}{label}</Text>
    <TextInput
      onChangeText={onChangeText}
      autoCapitalize={autoCapitalize}
      autoFocus={autoFocus}
      autoCorrect={autoCorrect}
      value={value}
      style={styles.input}
      underlineColorAndroid='transparent'
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      editable={editable}
      textContentType={textContentType}
    />
    { error && <Text style={styles.error}>{error}</Text> }
  </View>

PrimaryInput.propTypes = {
  autoCapitalize: PropTypes.string,
  autoCorrect: PropTypes.bool,
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
  keyboardType: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  required: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  value: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
  input: {
    color: '#555',
    borderColor: '#ccc',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    // flex: 1,
    flexDirection: 'row'
  },
  container: {
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

export default PrimaryInput
