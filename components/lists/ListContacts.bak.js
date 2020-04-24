import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, StyleSheet, FlatList } from 'react-native'

import { getListContacts } from '../../actions/lists'
import { getActiveList } from '../../selectors/listsSelectors'

import Loader from '../shared/Loader'
import Header from '../shared/Header'
import ListContactItem from './ListContactItem'

class ListContacts extends React.Component {

  componentDidMount() {
    const { dispatch, staffId, match } = this.props
    dispatch(getListContacts(match.params.listId, staffId))
  }

  render() {
    const { contacts, isLoading, activeList } = this.props
    return (
      <View style={styles.view}>
        <Header backButton={true} title={activeList.name || ""} />
        { isLoading
        ? <Loader />
        : <FlatList
            keyboardShouldPersistTaps='handled'
            data={contacts}
            keyExtractor={item => `${item.id}`}
            renderItem={({item}) => <ListContactItem contact={item} />}
          /> }
      </View>
    )
  }
}

ListContacts.propTypes = {
  activeList: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  contacts: PropTypes.array.isRequired,
  staffId: PropTypes.number.isRequired,
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  }
})

const mapStateToProps = (state) => {
  return {
    contacts: state.lists.contacts,
    isLoading: state.lists.isLoading,
    staffId: state.currentStaff.id,
    activeList: getActiveList(state)
  }
}

export default connect(mapStateToProps)(ListContacts)
