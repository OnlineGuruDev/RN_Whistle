import React from 'react'
import { StyleSheet, View } from 'react-native'
//import { Entypo } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Entypo'; 

import ContactMenu from './ContactMenu'
import Touchable from '../shared/Touchable'
import { ContactAvatar } from '../shared/AvatarBubbles'
import ContactDisplay from '../shared/ContactDisplay'

import { COLORS } from '../../reference/constants'

class ListContactItem extends React.Component {
  state = { active: false }
  render() {
    const { active } = this.state
    const { contact } = this.props
    return (
      <View>
        <Touchable onPress={() => this.setState((prevState) => ({active: !prevState.active}))}>
          <View style={active ? [styles.card, styles.activeCard] : styles.card}>
            <ContactAvatar contact={contact}/>
            <View style={styles.innerContactItem}>
              <ContactDisplay contact={contact} />
              <Icon style={styles.menuIcon} color={COLORS.GRAY} name={active ? 'circle-with-cross' : 'circle-with-plus'} size={35} />
            </View>
          </View>
        </Touchable>
        { active ? <ContactMenu contact={contact} /> : null }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  menuIcon: {
    fontSize: 24
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
  },
  activeCard: {
    backgroundColor: '#f9f9f9'
  },
  innerContactItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1
  },
  card: {
    flex: 1,
    height: 60,
    paddingVertical: 5,
    paddingHorizontal: 3,
    flexDirection: 'row',
  }
})


export default ListContactItem
