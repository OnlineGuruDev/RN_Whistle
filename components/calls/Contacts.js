import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import { View, SectionList, StyleSheet } from 'react-native'

import { loadContacts } from '../../actions/contacts'
import { UPDATE_CONTACT_QUERY } from '../../actions/types'
import { formattedContacts } from '../../selectors/contactsSelectors'

import ContactItem from '../shared/ContactItem'
import Loader from '../shared/Loader'
import ListLoader from '../shared/ListLoader'
import SectionHeader from '../shared/SectionHeader'
import SearchBar from '../shared/SearchBar'
import KeyboardView from '../shared/KeyboardView'

class Contacts extends React.Component {
  state = { page: 1 }

  componentDidMount() {
    const { dispatch, query } = this.props
    dispatch(loadContacts(1, query))
  }

  loadMore = () => {
    const { dispatch, query, canLoadMore, loadingMore } = this.props
    if (canLoadMore && !loadingMore) {
      this.setState( (prevState) => ({ page: prevState.page + 1}), () => dispatch(loadContacts(this.state.page, query)) )
    }
  }

  renderContact = ({ item }) => <ContactItem contact={item} />

  renderSectionHeader = ({ section }) => <SectionHeader text={section.title} />

  _search = debounce((query) => {
    if (query !== this.props.query)
      this.setState(() => ({ page: 1 }), () => {
        this.props.dispatch({ type: UPDATE_CONTACT_QUERY, query })
        this.props.dispatch(loadContacts(1, query))
      })
  }, 500)

  render() {
    return (
      <View style={styles.view}>
        <SearchBar defaultValue={this.props.query} search={this._search} />
        <KeyboardView offset={56 + 50} style={{flex: 1}}>
          { !this.props.loaded
          ? <View></View>//<Loader />
          : <SectionList
              keyboardShouldPersistTaps='handled'
              renderItem={this.renderContact}
              renderSectionHeader={this.renderSectionHeader}
              sections={this.props.contacts}
              stickySectionHeadersEnabled={true}
              keyExtractor={item => `${item.id}`}
              onEndReachedThreshold={0.1}
              onEndReached={this.loadMore}
            /> }
        { this.props.loadingMore && <ListLoader/> }
        </KeyboardView>
      </View>
    )
  }
}

Contacts.propTypes = {
  canLoadMore: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loaded: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  contacts: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
})

const mapStateToProps = (state) => {
  return {
    loaded: state.contacts.isLoaded,
    loadingMore: state.contacts.loadingMore,
    canLoadMore: state.contacts.canLoadMore,
    user: state.user,
    contacts: formattedContacts(state),
    query: state.contacts.contactSearchQuery,
  }
}
export default connect(mapStateToProps)(Contacts)
