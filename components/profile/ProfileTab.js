import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { ICONS } from '../../reference/constants'
import { getContactFieldsNoPics, getWidPicFields } from '../../selectors/contactFieldsSelectors'

import WidPicFieldItem from './WidPicFieldItem'
import SectionHeader from '../shared/SectionHeader'

const ProfileTab = ({
  wIDFields,
  wIDPicFields,
}) => {
  const renderItem = field =>
    // TODO: no more set height. let text flow and push the container.
    <View style={styles.listItem}>
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          { !!ICONS[field.field] && <Icon name={ICONS[field.field]['ios']} style={styles.icon} size={18}/> }
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{`${field.label}:`}</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.text}>{field.value}</Text>
      </View>
    </View>

  return (
    <View style={styles.view}>
      <ScrollView keyboardShouldPersistTaps='handled'>
        <SectionHeader text='Whistle ID Fields' />
        <FlatList
          keyboardShouldPersistTaps='handled'
          data={wIDFields}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={item => `${item.id}`}
        />
        <SectionHeader text='Whistle ID Pics' />
        <FlatList
          keyboardShouldPersistTaps='handled'
          data={wIDPicFields}
          renderItem={({ item }) => <WidPicFieldItem field={item}/>}
          keyExtractor={item => `${item.id}`}
        />
      </ScrollView>
    </View>
  )
}

ProfileTab.propTypes = {
  wIDFields: PropTypes.array.isRequired,
  wIDPicFields: PropTypes.array.isRequired,
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    flex: 1,
    height: 40,
    flexDirection: 'row',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    paddingHorizontal: 5,
  },
  icon: {
    color: '#98c950',
  },
  label: {
    color: '#4c6626',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#333',
  },
})

const mapStateToProps = state => ({
  wIDFields: getContactFieldsNoPics(state),
  wIDPicFields: getWidPicFields(state),
})

export default connect(mapStateToProps)(ProfileTab)
