import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'
import debounce from 'lodash/debounce'
import { View, StyleSheet, SectionList } from 'react-native'

import { loadContacts } from '../../actions/contacts'
import { UPDATE_CONTACT_QUERY } from '../../actions/types'
import { formattedContacts } from '../../selectors/contactsSelectors'

import Loader from '../shared/Loader'
import Header from '../shared/Header'
import ListLoader from '../shared/ListLoader'
import ContactItem from './ContactItem'
import SectionHeader from '../shared/SectionHeader'
import SearchBar from '../shared/SearchBar'
import KeyboardView from '../shared/KeyboardView'

class SelectContact extends React.Component {
  state = { page: 1 }

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

  goToMessage = contact => this.props.history.push(`/messages/conversation/${contact.id}`)

  loadMore = () => {
    const { dispatch, query, canLoadMore, loadingMore } = this.props
    if (canLoadMore && !loadingMore)
      this.setState((prevState) => ({ page: prevState.page + 1}), () => {
        dispatch(loadContacts(this.state.page, query))
      })
  }

  render() {
    const { contacts, query, isLoaded, loadingMore } = this.props
    return(
      <View style={styles.view}>
        <Header backButton={true} title='Select Contact' />
        <View style={styles.view}>
          <SearchBar defaultValue={this.props.query} search={this._search} />
          <KeyboardView offset={56} style={styles.view}>
            { !isLoaded
            ? <Loader />
            : <SectionList
                keyboardShouldPersistTaps='handled'
                ref={component => this._sectionList = component}
                renderItem={({item}) => <ContactItem item={item} goToMessage={this.goToMessage}/>}
                renderSectionHeader={headerItem => <SectionHeader text={headerItem.section.title} />}
                sections={contacts}
                stickySectionHeadersEnabled={true}
                keyExtractor={(item) => `${item.id}`}
                onEndReachedThreshold={0.1}
                onEndReached={this.loadMore}
              /> }
          </KeyboardView>
          { loadingMore && <ListLoader/> }
        </View>
      </View>
    )
  }
}

SelectContact.propTypes = {
  canLoadMore: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  contacts: PropTypes.array.isRequired,
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  containerStyle: {
    backgroundColor: '#98c950',
  }
})

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

export default withRouter(connect(mapStateToProps)(SelectContact))
