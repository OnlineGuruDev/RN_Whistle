import React from 'react'
import PropTypes from 'prop-types'
import { Text, Image, View, StyleSheet } from 'react-native'
import Touchable from '../Touchable'
import { WID } from '../../../images/SVGImages'
import { COLORS } from '../../../reference/constants'

const IdTagButton = ({tag, addWID}) =>
  <Touchable onPress={() => addWID(tag.field)}>
    <View style={styles.tagButton}>
      <WID fill={COLORS.LIGHT_GREEN} size={26}/>
      <Text style={styles.tagName}>{tag.label}</Text>
    </View>
  </Touchable>

IdTagButton.propTypes = {
  addWID: PropTypes.func.isRequired,
  tag: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  tagButton: {
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    margin: 3,
    flexDirection: 'row',
    alignItems: 'center',
    // added to fix iOS 12 onPress/svg issue, see https://github.com/react-native-community/react-native-svg/issues/794
    overflow: 'hidden',
  },
  tagName: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  }
})

export default IdTagButton
