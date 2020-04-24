import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-native'
import { View, StyleSheet } from 'react-native'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { ContactAvatar } from '../shared/AvatarBubbles'
import Touchable from '../shared/Touchable'
import ContactDisplay from '../shared/ContactDisplay'

class ContactItem extends React.PureComponent {

  selectProfile = () => this.props.history.push(`/profile/${this.props.contact.id}`)

  render() {
    return (
      <Touchable onPress={this.selectProfile}>
        <View style={styles.contactItem}>
          <ContactAvatar contact={this.props.contact} />
          <View style={styles.innerContactItem}>
            <ContactDisplay contact={this.props.contact} relationship={this.props.relationship}/>
            <Icon style={styles.icon} name='ios-arrow-forward' size={24} />
          </View>
        </View>
      </Touchable>
    )
  }
}

ContactItem.propTypes = {
  contact: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  contactItem: {
    height: 55,
    flex: 1,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  innerContactItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleFont: {
    fontSize: 18,
    color: '#555'
  },
  subtitleFont: {
    fontSize: 16,
    color: '#777'
  },
  icon: {
    color: '#bbb',
    paddingHorizontal: 7
  }
})

export default withRouter(ContactItem)
