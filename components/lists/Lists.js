import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'
import { FlatList } from 'react-native'

import { getLists } from '../../actions/lists'
import { formattedLists } from '../../selectors/listSelectors'

import Loader from '../shared/Loader'
import SelectCoach from '../shared/SelectCoach'
import ListItem from './ListItem'

class Lists extends React.Component {

  componentDidMount = () => {
    const { dispatch, staff } = this.props
    staff.kind === "coach" && dispatch(getLists(staff.id))
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { dispatch, staff } = this.props
    if (prevProps.staff.id !== staff.id && staff.kind === 'coach')
      dispatch(getLists(staff.id))
  }

  selectList = id => this.props.history.push(`/lists/select/${id}`)

  renderItem = ({item}) => <ListItem selectAction={this.selectList} item={item} />

  render() {
    const { staff, isLoading, lists } = this.props
    if (staff.kind !== "coach") return <SelectCoach pageName='Lists' />
    if (isLoading) return <Loader />
    return (
      <FlatList
        keyboardShouldPersistTaps='handled'
        renderItem={this.renderItem}
        keyExtractor={item => `${item.id}`}
        data={lists}
      />
    )
  }
}

Lists.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  lists: PropTypes.array.isRequired,
  staff: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    lists: formattedLists(state),
    staff: state.currentStaff,
    isLoading: state.lists.isLoading
  }
}

export default withRouter(connect(mapStateToProps)(Lists))
