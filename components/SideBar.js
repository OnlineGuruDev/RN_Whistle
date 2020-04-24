import React from 'react'
import PropTypes from 'prop-types'
import { ScrollView, View, Text } from 'react-native'
//import * as SecureStore from 'expo-secure-store';
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { connect } from 'react-redux'
import { setCurrentStaff } from '../actions/currentStaff'

import { StaffAvatar } from './shared/AvatarBubbles'
import Touchable from './shared/Touchable'

const SideBar = ({ coaches, currentStaffId, close, setCurrentStaff }) => {
  const selectCoach = id => {
    setCurrentStaff(id)
    // this causes wrong staff issue when opening app from push notification (which sets currentStaff to push notification staff)
    // SecureStore.setItemAsync('selected-coach', id.toString())
    close()
  }

  const coachItem = item => {
    const selected = item.id === currentStaffId
    return (
      <Touchable key={item.id} onPress={() => selectCoach(item.id)}>
        <View style={[styles.listItem, selected && styles.selected]}>
          <StaffAvatar name={item.name} image={item.picture} />
          <View style={styles.nameTitleBlock}>
            <Text style={styles.name}>{item.name}</Text>
            <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
          </View>
          <View style={styles.arrow}>
            <Icon name='ios-arrow-forward' color='#fff' size={28} />
          </View>
        </View>
      </Touchable>
    )
  }

  return (
    <ScrollView style={styles.sidebarView}>
      <Text style={styles.headerText}>Select a Coach</Text>
      <View style={styles.container}>
        {coaches.map(c => coachItem(c))}
      </View>
    </ScrollView>
  )
}

SideBar.propTypes = {
  coaches: PropTypes.array.isRequired,
  currentStaffId: PropTypes.number,
  setCurrentStaff: PropTypes.func.isRequired,
}

const styles = {
  container: {
    flex: 1
  },
  sidebarView: {
    flex: 1,
    backgroundColor: '#333',
    paddingHorizontal: 10
  },
  headerText: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
    color: '#fff',
    alignSelf: 'center'
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#666',
    marginVertical: 5
  },
  selected: {
    backgroundColor: '#98c950'
  },
  arrow: {
    marginLeft: 'auto',
    marginRight: 5
  },
  nameTitleBlock: {
    flex: 1,
    paddingRight: 5
  },
  name: {
    color: '#fff',
    fontSize: 15
  },
  title: {
    color: '#ddd',
    fontSize: 11
  }
}

const mapStateToProps = (state) => {
  return {
    coaches: state.user.coaches,
    currentStaffId: state.currentStaff.id
  }
}

export default connect(mapStateToProps, { setCurrentStaff })(SideBar)
