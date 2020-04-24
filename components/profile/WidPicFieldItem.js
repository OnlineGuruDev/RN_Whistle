import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { StyleSheet, View, Text, Dimensions } from 'react-native'

import { getWIDPic } from '../../selectors/contactFieldsSelectors'
import { COLORS } from '../../reference/constants'

import ImageModal from '../shared/ImageModal'

const WidPicFieldItem = ({ field, whistlePic }) =>
  <View key={field.field} style={styles.listItem}>
    <View style={styles.leftContainer}>
      <View style={styles.iconContainer}>
        <Icon name='md-image' style={styles.icon} size={18} />
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{`${field.label}:`}</Text>
      </View>
    </View>
    <View style={styles.imageContainer}>
      <ImageModal style={styles.image} source={{ uri: whistlePic?.image_url }} resizeMode='cover' />
    </View>
  </View>

WidPicFieldItem.propTypes = {
  field: PropTypes.object.isRequired,
  whistlePic: PropTypes.object
}

const thumbSize = parseInt(Dimensions.get('window').width / 2) - 40

const styles = StyleSheet.create({
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY,
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelContainer: {
    paddingHorizontal: 5
  },
  icon: {
    color: COLORS.LIGHTER_GREEN
  },
  label: {
    color: COLORS.DARK_GREEN
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: thumbSize,
    height: thumbSize,
    borderRadius: 3
  }
})

const mapStateToProps = (state, props) => ({
  whistlePic: getWIDPic(state, props)
})

export default connect(mapStateToProps)(WidPicFieldItem)
