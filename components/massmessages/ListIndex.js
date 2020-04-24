import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatList } from 'react-native'

import { addRecipientsToNewMessage, removeRecipientsFromMessage } from '../../actions/massMessages'
import { getLists } from '../../actions/lists'
import { formattedLists } from '../../selectors/listSelectors'

import Loader from '../shared/Loader'
import SelectCoach from '../shared/SelectCoach'
import ListItem from '../lists/ListItem'

class ListIndex extends React.Component {
  state = { loaded: false }

  componentDidMount() {
    const { dispatch, staff } = this.props
    dispatch(getLists(staff.id))
  }

  selectList = id => {
    const { dispatch, massLists, staff } = this.props
    if (massLists.includes(id))
      dispatch(removeRecipientsFromMessage(id, staff.id))
    else
      dispatch(addRecipientsToNewMessage(id, staff.id))
  }

  renderItem = ({item}) => {
    const included = this.props.massLists.includes(item.id)
    const selecting = this.props.selectingListIds.includes(item.id)
    return (
      <ListItem selectAction={this.selectList} selecting={selecting} item={item} checkIcon={true} active={included}/>
    )
  }

  render() {
    if (this.props.isLoading) return <Loader />
    if (!this.props.staff.id) return <SelectCoach page='Lists' />
    return (
      <FlatList
        keyboardShouldPersistTaps='handled'
        renderItem={this.renderItem}
        data={this.props.lists}
        keyExtractor={item => `${item.id}`}
        extraData={{extraData: "re-render on select"}}
      />
    )
  }
}

ListIndex.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  lists: PropTypes.array.isRequired,
  massLists: PropTypes.array.isRequired,
  selectingListIds: PropTypes.array.isRequired,
  staff: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    lists: formattedLists(state),
    staff: state.currentStaff,
    isLoading: state.lists.isLoading,
    massLists: state.massMessages.massLists,
    selectingListIds: state.massMessages.selectingListIds
  }
}

export default connect(mapStateToProps)(ListIndex)
