import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 


import Touchable from '../shared/Touchable'
import { ContactAvatar } from '../shared/AvatarBubbles'
import ContactDisplay from '../shared/ContactDisplay'

class ContactItem extends PureComponent {
  render() {
    const { item, goToMessage } = this.props
    return (
      <Touchable onPress={() => goToMessage(item)}>
        <View style={styles.contactItem}>
          <ContactAvatar contact={item} />
          <View style={styles.innerContactItem}>
            <ContactDisplay contact={item}/>
            <Icon style={styles.icon} name='ios-arrow-forward' size={24}/>
          </View>
        </View>
      </Touchable>
    )
  }
}

ContactItem.propTypes = {
  goToMessage: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  contactItem: {
    height: 60,
    paddingVertical: 5,
    paddingHorizontal: 3,
    flexDirection: 'row',
    alignItems: 'center'
  },
  innerContactItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1
  },
  icon: {
    color: '#bbb',
    paddingHorizontal: 7
  }
})

export default ContactItem
