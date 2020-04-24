import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import { View, StyleSheet, SectionList } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { loadContacts } from '../../actions/contacts'
import { UPDATE_CONTACT_QUERY } from '../../actions/types'
import { addRecipient, removeRecipient } from '../../actions/massMessages'
import { formattedContacts } from '../../selectors/contactsSelectors'

import Touchable from '../shared/Touchable'
import Loader from '../shared/Loader'
import ListLoader from '../shared/ListLoader'
import { ContactAvatar } from '../shared/AvatarBubbles'
import ContactDisplay from '../shared/ContactDisplay'
import SectionHeader from '../shared/SectionHeader'
import SearchBar from '../shared/SearchBar'
import KeyboardView from '../shared/KeyboardView'

class Contacts extends React.Component {
  state = {
    massRecipients: this.props.recipients,
    page: 1
  }

  componentDidMount() {
    this.props.dispatch(loadContacts(1, this.props.query))
  }

  toggleRecipient = (id, included) => {
    if (included) {
      this.props.dispatch(removeRecipient(id))
    } else {
      this.props.dispatch(addRecipient(id))
    }
  }

  _search = debounce((query) => {
    if (query !== this.props.query)
      this.setState(() => ({ page: 1 }), () => {
        this.props.dispatch({ type: UPDATE_CONTACT_QUERY, query})
        this.props.dispatch(loadContacts(1, query))
      })
  }, 500)

  renderItem = ({item}) => {
    const included = this.props.recipients.includes(item.id)
    return(
      <Touchable onPress={ () => this.toggleRecipient(item.id, included)}>
        <View style={ included ? [styles.contactItem, {backgroundColor: '#f5f5f5'}] : styles.contactItem}>
          <ContactAvatar contact={item} />
          <View style={styles.innerContactItem}>
            <ContactDisplay contact={item} />
            <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 12}}>
              <Icon style={included ? {color: '#ff8100'} : {color: '#ddd'}} size={40} name='ios-checkmark-circle-outline' />
            </View>
          </View>
        </View>
      </Touchable>
    )
  }

  loadMore = () => {
    const { dispatch, query, canLoadMore, loadingMore } = this.props
    if (canLoadMore && !loadingMore)
      this.setState((prevState) => ({page: prevState.page + 1}), () => {
        dispatch(loadContacts(this.state.page, query))
      })
  }

  render() {
    const { contacts, query, isLoaded, loadingMore } = this.props
    return (
      <View style={styles.view}>
        <SearchBar search={this._search} defaultValue={query} />
        <KeyboardView offset={56 + 50} style={styles.view}>
          { !isLoaded
          ? <Loader />
          : <SectionList
              keyboardShouldPersistTaps='handled'
              ref={component => this._sectionList = component}
              renderItem={this.renderItem}
              renderSectionHeader={headerItem => <SectionHeader text={headerItem.section.title} />}
              sections={contacts}
              stickySectionHeadersEnabled={true}
              keyExtractor={item => `${item.id}`}
              onEndReachedThreshold={0.1}
              onEndReached={this.loadMore}
            /> }
        </KeyboardView>
        { loadingMore && <ListLoader/> }
      </View>
    )
  }
}

Contacts.propTypes = {
  canLoadMore: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  contacts: PropTypes.array.isRequired,
  recipients: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  contactItem: {
    height: 60,
    paddingVertical: 5,
    paddingHorizontal: 3,
    flexDirection: 'row',
  },
  innerContactItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1
  },
  containerStyle: {
    backgroundColor: '#98c950',
  },
  titleFont: {
    fontSize: 18,
    color: '#555',
  },
  subtitleFont: {
    fontSize: 16,
    color: '#777'
  }
})

const mapStateToProps = (state) => {
  return {
    canLoadMore: state.contacts.canLoadMore,
    isLoaded: state.contacts.isLoaded,
    loadingMore: state.contacts.loadingMore,
    query: state.contacts.contactSearchQuery,
    recipients: state.massMessages.recipients,
    contacts: formattedContacts(state),
  }
}

export default connect(mapStateToProps)(Contacts)
