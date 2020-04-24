import React from 'react'
import PropTypes from 'prop-types'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'

import { formatDateWithTime } from '../../reference/functions'

import { ListAvatar } from '../shared/AvatarBubbles'
import Touchable from '../shared/Touchable'

const ListItem = ({selectAction, item, active = false, checkIcon = false, selecting = false}) => {
  return (
    <Touchable onPress={() => selectAction(item.id)}>
      <View style={active ? [styles.contactItem, styles.activeItem] : styles.contactItem}>
        <ListAvatar list={item} />
        <View style={styles.innerContactItem}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text numberOfLines={1} style={styles.titleFont}>{item.name}</Text>
            <Text numberOfLines={1} style={styles.subtitleFont}>{ formatDateWithTime(item.created_at) }</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 12}}>
            { selecting
            ? <ActivityIndicator color='#ddd' animating size='large' />
            : <Icon
                style={active ? styles.activeIcon : styles.defaultIcon}
                size={40}
                name={checkIcon ? 'ios-checkmark-circle-outline' : 'ios-arrow-forward'}
              /> }
          </View>
        </View>
      </View>
    </Touchable>
  )
}

ListItem.propTypes = {
  active: PropTypes.bool,
  checkIcon: PropTypes.bool,
  item: PropTypes.object.isRequired,
  selectAction: PropTypes.func.isRequired,
  selecting: PropTypes.bool
}

const styles = StyleSheet.create({
  activeIcon: {
    color: '#ff8100'
  },
  activeItem: {
    backgroundColor: '#f5f5f5'
  },
  contactItem: {
    height: 55,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleFont: {
    fontSize: 18,
    color: '#555'
  },
  subtitleFont: {
    fontSize: 12,
    color: '#777'
  },
  defaultIcon: {
    color: '#ddd'
  },
  innerContactItem: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 5
  }
})

export default ListItem
