import React from 'react'
import PropTypes from 'prop-types'
//import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { View, Text, StyleSheet } from 'react-native'

import { formatDateWithTime } from '../../reference/functions'

import Touchable from '../shared/Touchable'

const SentItem = ({ item, toDetails }) => {
  return (
    <Touchable onPress={() => toDetails(item)}>
      <View style={styles.sentItemContainer}>
        <View style={styles.body}>
          <Text numberOfLines={1} style={styles.bodyText}>{item.media ? "[media] " : null}{item.body}</Text>
          <Text style={styles.subtitleFont}>{ formatDateWithTime(item.processed_at) }</Text>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: 40}}>
            <Text style={{color: "#d9534f"}}>{item.error_count} </Text>
            <Icon style={{color: '#d9534f'}} name={"exclamation-circle"} size={16} />
          </View>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: 40}}>
            <Text style={{color: "grey"}}>{item.sending_count} </Text>
            <Icon style={{color: 'grey'}} name={"ellipsis-h"} size={16} />
          </View>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: 40}}>
            <Text style={{color: "green"}}>{item.success_count} </Text>
            <Icon style={{color: 'green'}} name={"check"} size={16} />
          </View>
        </View>
      </View>
    </Touchable>
  )
}

SentItem.propTypes = {
  item: PropTypes.object.isRequired,
  toDetails: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  sentItemContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  body: {
    flex: 1,
    paddingRight: 5
  },
  bodyText: {
    fontSize: 14,
    color: '#333'
  },
  subtitleFont: {
    fontSize: 12,
    color: '#777'
  }
})

export default SentItem
