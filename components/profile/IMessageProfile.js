import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { StyleSheet, View, Text, Alert, TextInput } from 'react-native'
//import { LinearGradient } from 'expo-linear-gradient'
import LinearGradient from 'react-native-linear-gradient';

import { Switch, Redirect, Route, withRouter } from 'react-router-native'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import Ionicons from 'react-native-vector-icons/Ionicons';
import debounce from 'lodash/debounce'
import Touchable from '../shared/Touchable'
import ImageButton from '../../components/ImageButton'

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
const phonebookImg = require('../../images/phone_book.png')

class IMessageProfile extends React.Component {
  state = {
    page: 1,
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
    const { loadNotes, loadContact, match, selectedContact } = this.props
    loadNotes(selectedContact.id)
    loadContact(selectedContact.id).then(res => {
      console.log('Success========>')
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

  _search = debounce(query => {
    if (query !== this.props.query)
      this.setState(() => ({ page: 1 }), () => {
        this.props.dispatch({ type: UPDATE_CONTACT_QUERY, query })
        this.props.dispatch(loadContacts(1, query))
      })
  }, 500)

  goBack = () => {
    this.props.setViewIndex(0)
  }


  render() {
    const { contact, history, match, query } = this.props

    if (!this.state.loaded) return <Loader />
    const { first_name, last_name, institute } = contact.data.metadata.fields

    const tab1Path = `/profile/${match.params.contactId}/profile-tab`
    const tab2Path = `/profile/${match.params.contactId}/notes`
    const tab3Path = `/profile/${match.params.contactId}/relationships`
    return (    
      <View style={{flex: 1}}>
        <View style={styles.searchSection}>          
          <Ionicons
            style={styles.searchIcon}
            name="ios-search"
            size={20}
            color="#a8a9ac"
          />
          <TextInput
            style={styles.searchInput}
            placeholder={'Find images'}
            underlineColorAndroid="transparent"
            defaultValue={query}
            onChangeText={text => this.search(text)}
          />
        </View>
        <View style = {styles.titleSection}>
          <Touchable onPress={() => this.goBack()}>
            <Ionicons
              style={styles.backIcon}
              name="ios-arrow-back"
              size={20}
              color="#a8a9ac"
            />
          </Touchable>
          <Text style={styles.contactTxt}>CONTACTS</Text>
          <ImageButton
            style={styles.bookContainer}
            imgstyle={styles.bookImg}
            img={phonebookImg}
            onPress={this.onPhoneBookView}
          />
        </View>
        {/* <View style={styles.logoView}>
          <Image source={Logo} style={styles.logo} />
        </View>
        <View style={styles.formContainer}>
          <PrimaryInput
            required
            label='Email'
            textContentType='username'
            keyboardType='email-address'
            onChangeText={v => this.setState({ email: v })}
            value={email}
            error={errors.email}
          />
          <PrimaryInput
            required
            secureTextEntry={true}
            label='Password'
            textContentType='password'
            onChangeText={v => this.setState({ password: v })}
            value={password}
            error={errors.password}
          />
          <View style={styles.submitContainer}>
            <PrimaryButton spinner={user.isFetchingAuth} action={this.submit} text='Login' />
            <Touchable onPress={this.forgotPassword}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </Touchable>
          </View>
        </View> */}
      </View>
    )
  }
}

IMessageProfile.propTypes = {
  history: PropTypes.object.isRequired,
  loadNotes: PropTypes.func.isRequired,
  loadContact: PropTypes.func.isRequired,
  deleteContact: PropTypes.func.isRequired,
  clearCurrentContact: PropTypes.func.isRequired,
  contact: PropTypes.object.isRequired,
  userKind: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  selectedContact:PropTypes.object.isRequired,
  query: PropTypes.string.isRequired,
}

const styles = {
  screenStyle: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 15
  },
  searchSection: {
    alignSelf: 'center',
    width: '96%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#efeff1',
  },
  searchInput: {
    flex: 1,
    padding: 8,
    paddingLeft: 0,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: '#efeff1',
  },
  searchIcon: {
    padding: 10,
  },
  titleSection: {
    alignSelf: 'center',
    width: '96%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15
  },
  contactTxt: {
    fontSize: 16
  },
  backIcon: {
    paddingLeft: 5,
  },
  bookContainer: {
    width:  30,
    alignItems: 'center'
  },
  bookImg: {
    width: '100%',
    height: 25,
    resizeMode: 'contain',
    tintColor: '#a8a9ac'
  },


  title: {
    color: '#555',
    fontSize: 24
  },
  formContainer: {
    margin: 15
  },
  submitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoView: {
    alignSelf: 'center',
    flex: 1,
    marginTop: 15
  },
  logo: {
    flex: 1,
    resizeMode: 'contain',
  },
  forgotPassword: {
    marginVertical: 5,
    color: COLORS.DARK_GRAY,
  },
}

const mapStateToProps = (state, props) => ({
  currentStaff: state.currentStaff,
  contact: state.currentContact,
  userKind: state.user.kind,
  selectedContact: props.selectedContact,
  query: state.contacts.contactSearchQuery
})

export default withRouter(connect(mapStateToProps, {
  loadNotes,
  loadContact,
  clearCurrentContact,
  deleteContact,
})(IMessageProfile))
