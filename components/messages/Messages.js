import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'
import { View, StyleSheet, FlatList } from 'react-native'

import { loadActivities } from '../../actions/activities'
import { getActivitiesOrdered } from '../../selectors/activitySelectors'

import SelectCoach from '../shared/SelectCoach'
import Loader from '../shared/Loader'
import ListLoader from '../shared/ListLoader'
import MessageItem from './MessageItem'

class Messages extends React.Component {
  state = { page: 1 }

  componentDidMount() {
    this.props.currentStaff.kind === "coach" && this.fetchActivities()
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.currentStaff.id !== this.props.currentStaff.id) {
      this.fetchActivities()
    }
  }

  fetchActivities = () => this.props.loadActivities(this.props.currentStaff.id)

  fetchMoreActivities = () => {
    const { isLoaded, canLoadMore, loadingMore, currentStaff, loadActivities } = this.props
    if (!canLoadMore || loadingMore || !isLoaded) return
    const newPage = this.state.page + 1
    this.setState({page: newPage})
    loadActivities(currentStaff.id, newPage)
      .then(res => {
        this.list.flashScrollIndicators()
      })
  }

  toConversation = contact => {
    this.props.history.push(`/messages/conversation/${contact.id}`)
  }

  render() {
    let { currentStaff, loadingMore, activities, isLoaded } = this.props
    if (currentStaff.kind !== 'coach') return <SelectCoach pageName="Messages"/>
    if (!isLoaded) return <Loader/>
    return (
      <View style={styles.messagesContainer}>
        <FlatList
          keyboardShouldPersistTaps='handled'
          data={activities}
          ref={list => this.list = list}
          keyExtractor={item => `${item.id}`}
          onEndReached={this.fetchMoreActivities}
          onEndReachedThreshold={0.1}
          renderItem={({item}) =>
            <MessageItem item={item} toConversation={this.toConversation} />
          }
        />
        { loadingMore && <ListLoader/> }
      </View>
    )
  }
}

Messages.propTypes = {
  activities: PropTypes.array.isRequired,
  canLoadMore: PropTypes.bool.isRequired,
  currentStaff: PropTypes.object.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  loadActivities: PropTypes.func.isRequired,
  loadingMore: PropTypes.bool.isRequired,
}

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
  }
})

const mapStateToProps = state => {
  return {
    activities: getActivitiesOrdered(state),
    isLoaded: state.activities.isLoaded,
    loadingMore: state.activities.loadingMore,
    canLoadMore: state.activities.canLoadMore,
    currentStaff: state.currentStaff,
  }
}

export default withRouter(connect(mapStateToProps, {
  loadActivities,
})(Messages))
