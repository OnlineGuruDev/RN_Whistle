import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 
import { View, Text, FlatList, StyleSheet } from 'react-native'

import { tagCall } from '../../actions/voiceActivities'

import Touchable from '../shared/Touchable'
import ModalHeader from '../shared/ModalHeader'
import Modal from '../shared/Modal'

const CallTags = ({call, close, modalVisible, tags, tagCall}) => {
  const renderItem = ({item}) => {
    const matching = call.call_tag === item.key
    return (
      <Touchable onPress={() => handleCallTagPress(item.key)}>
        <View style={matching ? [styles.callTagItem, {backgroundColor: '#e0e0e0'}] : styles.callTagItem}>
          <View style={styles.innerContactItem}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text>{item.value}</Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 15}}>
            <Icon style={matching ? [styles.icon, {color: '#ff8100'}] : [styles.icon, {color: '#ddd'}]} size={40} name='ios-checkmark-circle-outline' />
              {/* <Ionicons style={matching ? [styles.icon, {color: '#ff8100'}] : [styles.icon, {color: '#ddd'}]} size={40} name='ios-checkmark-circle-outline' /> */}
            </View>
          </View>
        </View>
      </Touchable>
    )
  }

  const handleCallTagPress = tag => {
    tagCall(call.id, tag)
    close()
  }

  return (
    <View>
      { modalVisible &&
        <Modal animationType='slide' onRequestClose={close} visible={modalVisible}>
          <ModalHeader
            title="Tag call"
            close={close}
          />
          <View style={{ backgroundColor: '#fff' }}>
            <FlatList
              keyboardShouldPersistTaps='handled'
              data={tags}
              renderItem={renderItem}
              keyExtractor={item => `${item.key}`}
            />
          </View>
        </Modal>
      }
    </View>
  )
}

CallTags.propTypes = {
  call: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  tagCall: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  tags: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  callTagItem: {
    height: 50,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
  },
  innerContactItem: {
    flexDirection: 'row',
    flex: 1
  },
  selectedItem: {
    backgroundColor: '#ccc'
  },
  icon: {
    flex: 1
  },
  selectedIcon: {
    marginLeft: 15,
    marginRight: 15,
    color: '#509a3b'
  },
  titleFont: {
    fontSize: 18,
    color: '#555',
    paddingVertical: 10
  }
})

export default connect(null, { tagCall })(CallTags)
