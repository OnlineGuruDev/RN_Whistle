import React from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-native'

import {Alert, StyleSheet, View, TextInput, Text, SectionList} from 'react-native'
import { COLORS } from '../reference/constants'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Touchable from './shared/Touchable'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import ImageButton from '../components/ImageButton'

import { loadContacts } from '../actions/contacts'
import { UPDATE_CONTACT_QUERY } from '../actions/types'
import { formattedContacts } from '../selectors/contactsSelectors'

import Loader from './shared/Loader'
import Header from './shared/Header'
import ListLoader from './shared/ListLoader'
import ContactItem from './messages/ContactItem'
import SectionHeader from './shared/SectionHeader'
import SearchBar from './shared/SearchBar'
import KeyboardView from './shared/KeyboardView'
import IMessageProfile from '../components/profile/IMessageProfile'

const phonebookImg = require('../images/phone_book.png')

class PlayProfiles extends React.Component {
  state = {  
    sFModalOpen: true,
    page: 1,
    viewFlag: 0,
    selectedContact: {},
  }

  componentDidMount() {
    this.props.dispatch(loadContacts(1, this.props.query))
  }

  _search = debounce(query => {
    if (query !== this.props.query)
      this.setState(() => ({ page: 1 }), () => {
        this.props.dispatch({ type: UPDATE_CONTACT_QUERY, query })
        this.props.dispatch(loadContacts(1, query))
      })
  }, 500)

  goToProfile = (contact) => {
    console.log(contact)
    this.setState({viewFlag: 1, selectedContact: contact})
  }

  loadMore = () => {
    const { dispatch, query, canLoadMore, loadingMore } = this.props
    if (canLoadMore && !loadingMore)
      this.setState((prevState) => ({ page: prevState.page + 1}), () => {
        dispatch(loadContacts(this.state.page, query))
      })
  }

  handleSFPress = (file) => {
    this.props.handleSFPress(file)
    this.closeSFModal()
  }
  closeSFModal = () => this.setState({ sFModalOpen: false })
  openSFModal = () => this.setState({ sFModalOpen: true })
  
  goBack = () => {
    this.props.setViewIndex(0)
  }

  setViewIndex = (index) => {
    this.setState({ viewFlag: index })
  }

  MakeView = (flag) => {
    console.log('!!')
    console.log(flag)
    // if (flag == 3) return null
    if (flag > 0)
      return (
        <IMessageProfile selectedContact={this.state.selectedContact} setViewIndex={this.setViewIndex} />
      )
    else
      return null
  }

  RenderMainView = (flag) => {
    const { contacts, query, isLoaded, loadingMore } = this.props
    if(flag > 0) return null
    return(
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
            placeholder={'Find player'}
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
        <KeyboardView offset={56} style={styles.view}>
          { !isLoaded
          ? <Loader />
          : <SectionList
              keyboardShouldPersistTaps='handled'
              ref={component => this._sectionList = component}
              renderItem={({item}) => <ContactItem item={item} goToMessage={this.goToProfile}/>}
              renderSectionHeader={headerItem => <SectionHeader text={headerItem.section.title} />}
              sections={contacts}
              stickySectionHeadersEnabled={true}
              keyExtractor={(item) => `${item.id}`}
              onEndReachedThreshold={0.1}
              onEndReached={this.loadMore}
            /> }
        </KeyboardView>
      </View>
    )
  }

  render() {
    const { viewFlag } = this.state;
    return(
      <View style={styles.view}>
        {this.MakeView(viewFlag)}
        {this.RenderMainView(viewFlag)}
      </View>
    )
  }
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
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
})

PlayProfiles.propTypes = {
  canLoadMore: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  contacts: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return{
    currentStaff: state.currentStaff,
    contacts: formattedContacts(state),
    canLoadMore: state.contacts.canLoadMore,
    isLoaded: state.contacts.isLoaded,
    loadingMore: state.contacts.loadingMore,
    query: state.contacts.contactSearchQuery
  }
}

export default withRouter(connect(mapStateToProps)(PlayProfiles))

// export default withRouter(PlayProfiles)