import React from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet } from 'react-native'
import { COLORS } from '../../reference/constants'

class SectionHeader extends React.PureComponent {
  render() {
    return <Text numberOfLines={1} style={styles.header}>{this.props.text}</Text>
  }
}

SectionHeader.propTypes = {
  text: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  header: {
    height: 20,
    backgroundColor: COLORS.LIGHTER_GRAY,
    color: COLORS.DARKER_GRAY,
    fontSize: 14,
    paddingLeft: 10,
  }
})

export default SectionHeader
