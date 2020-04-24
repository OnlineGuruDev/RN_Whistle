import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { StyleSheet, View, Text, Alert } from 'react-native'
//import { LinearGradient } from 'expo-linear-gradient'
import LinearGradient from 'react-native-linear-gradient';

import { Switch, Redirect, Route, withRouter } from 'react-router-native'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 


import { loadNotes } from '../../actions/notes'
import { loadContact } from '../../actions/contacts'
import {
  clearCurrentContact,
  deleteContact,
} from '../../actions/currentContact'
import { COLORS } from '../../reference/constants'

import ProfileTab from './ProfileTab'
import ProfileButtons from './ProfileButtons'
import NotesContainer from './NotesContainer'
import Relationships from './Relationships'
import ProfileHeader from '../shared/ProfileHeader'
import ThreeTabs from '../shared/ThreeTabs'
import Loader from '../shared/Loader'

class Profile extends React.Component {
  state = {
    loaded: false,
  }

  componentDidMount() {
    this.loadContactProfile()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.contactId !== this.props.match.params.contactId) {
      this.loadContactProfile()
    }
  }

  componentWillUnmount() {
    this.props.clearCurrentContact()
  }

  loadContactProfile = () => {
    this.setState({ loaded: false })
    const { loadNotes, loadContact, match } = this.props
    loadNotes(match.params.contactId)
    loadContact(match.params.contactId).then(res => {
      this.setState({ loaded: true })
    })
  }

  deleteContact = async () => {
    const { ok } = await this.props.deleteContact(this.props.contact.data.id)
    if (ok) return this.props.history.push('/messages')
  }

  handleDelete = () => Alert.alert('Confirm', `Are you sure you want to delete ${this.props.contact.data.title}?`,
    [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => this.deleteContact() },
    ]
  )

  render() {
    const { contact, history, match } = this.props


    console.log("@@==>")
    console.log(contact)
    console.log(match)

    if (!this.state.loaded) return <Loader />
    const { first_name, last_name, institute } = contact.data.metadata.fields

    const tab1Path = `/profile/${match.params.contactId}/profile-tab`
    const tab2Path = `/profile/${match.params.contactId}/notes`
    const tab3Path = `/profile/${match.params.contactId}/relationships`
    return (    
      <View style={styles.view}>
        <ProfileHeader
          title={`${first_name} ${last_name}`}
          menu={
            <Menu>
              <MenuTrigger>
                <View style={styles.iconContainer}>
                  <Icon name='md-more' color={COLORS.WHITE} size={28} />
                </View>
              </MenuTrigger>
              <MenuOptions customStyles={{ optionText: styles.optionText }}>
                <MenuOption style={styles.menuOption} onSelect={() => history.push(`/profile-edit/${match.params.contactId}`)}>
                  <Icon name='md-create' color={COLORS.DARKER_GRAY} size={18} />
                  <Text style={styles.optionText}>Edit</Text>
                </MenuOption>
                <MenuOption style={styles.menuOption} onSelect={this.handleDelete}>
                  <Icon name='md-trash' color={COLORS.ALERT_RED} size={18} />
                  <Text style={[styles.optionText, styles.delete]}>Delete</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          }
        />
        <View style={styles.subHeader}>
          <LinearGradient
            colors={[COLORS.DARKER_GRAY, COLORS.DARKER_GRAY]}
            start={{x:0.0, y:0.0}}//{[0, 0]}
            location={[COLORS.DARKER_GRAY, COLORS.DARKER_GRAY]}
            style={styles.gradient}
          />
          <ProfileButtons />
          <View style={styles.institute}>
            <Text numberOfLines={1} style={styles.instituteFont}>{institute}</Text>
          </View>
        </View>
        <ThreeTabs
          tab1Path={tab1Path}
          tab1={'Profile'}
          tab2Path={tab2Path}
          tab2={'Notes'}
          tab3Path={tab3Path}
          tab3={'Relationships'}
        />
        <Switch>
          <Route exact path={`/profile/${match.params.contactId}`} render={() => <Redirect to={tab1Path} />} />
          <Route path={tab1Path} component={ProfileTab} />
          <Route path={tab2Path} component={NotesContainer} />
          <Route path={tab3Path} component={Relationships} />
        </Switch>
      </View>
    )
  }
}

Profile.propTypes = {
  history: PropTypes.object.isRequired,
  loadNotes: PropTypes.func.isRequired,
  loadContact: PropTypes.func.isRequired,
  deleteContact: PropTypes.func.isRequired,
  clearCurrentContact: PropTypes.func.isRequired,
  contact: PropTypes.object.isRequired,
  userKind: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 35,
  },
  institute: {
    alignItems: 'center',
    height: 20,
    justifyContent: 'center',
    marginTop: 5,
  },
  instituteFont: {
    fontSize: 16,
  },

  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  delete: {
    color: COLORS.ALERT_RED,
  },
  iconContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 18,
  },
})

const mapStateToProps = (state) => ({
  currentStaff: state.currentStaff,
  contact: state.currentContact,
  userKind: state.user.kind,
})

export default withRouter(connect(mapStateToProps, {
  loadNotes,
  loadContact,
  clearCurrentContact,
  deleteContact,
})(Profile))
