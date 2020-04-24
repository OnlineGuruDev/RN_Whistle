import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router-native'
import { FlatList } from 'react-native'

import { BASE_URL } from '../../reference/constants'

import Loader from '../shared/Loader'
import SelectCoach from '../shared/SelectCoach'
import MsgScreen from '../shared/MsgScreen'
import SentItem from './SentItem'

class Sent extends React.Component {
  state = {
    isLoaded: false,
    page: 1,
    canLoadMore: false,
    loadingMore: false,
    messages: [],
    source: axios.CancelToken.source()
  }

  componentDidMount() {
    if (this.props.currentStaff.id) this.getMessages()
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.currentStaff.id && prevProps.currentStaff.id !== this.props.currentStaff.id) {
      this.setState({isLoaded: false, page: 1, canLoadMore: false, loadingMore: false, messages: []})
      this.getMessages()
    }
  }

  componentWillUnmount() {
    this.state.source.cancel("poller canceled")
  }

  getMessages = (page=1) => {
    axios.get(BASE_URL + `/api/v2/messages/sent.json?page=${page}`, {
      headers: { onbehalf: this.props.currentStaff.id },
      cancelToken: this.state.source.token
    })
      .then(({ data }) => {
        this.setState(prevState =>
          ({messages: [...prevState.messages, ...data.sent], isLoaded: true, canLoadMore: data.canLoadMore})
        )
      })
      .catch(thrown => {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message)
        } else {
          this.setState({isLoaded: true})
        }
      })
  }

  toDetails = message => {
    //if(message.display_kind === 'Text Message')
      this.props.history.push(`/messenger/details/${message.id}`)
    //else
      //this.props.history.push(`/pushlist/${message.id}`)
  }

  fetchMore = () => {
    const { canLoadMore, loadingMore } = this.state
    if (!canLoadMore || loadingMore) return
    const newPage = this.state.page + 1
    this.setState({ page: newPage })
    this.getMessages(newPage)
    this.sentMessages.flashScrollIndicators()
  }

  render() {
    const { currentStaff } = this.props
    if (!currentStaff.id) return <SelectCoach pageName="Sent Mass Messages"/>
    if (!this.state.isLoaded) return <Loader />
    if (!this.state.messages.length) return <MsgScreen message="No sent messages."/>

    return (
      <FlatList
        keyboardShouldPersistTaps='handled'
        ref={(sentMessages) => { this.sentMessages = sentMessages }}
        onEndReached={this.fetchMore}
        onEndReachedThreshold={0.1}
        data={this.state.messages}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) => <SentItem item={item} toDetails={this.toDetails} />}
      />
    )
  }
}

Sent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentStaff: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    currentStaff: state.currentStaff
  }
}

export default withRouter(connect(mapStateToProps)(Sent))
