import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { AppState } from 'react-native'
import { BASE_URL } from '../../reference/constants'
import { UPDATE_CONVERSATION_ITEM, APPEND_TO_CONVERSATION } from '../../actions/types'

const messageBusId =
  Array(16 + 1).join('x').replace(/x/g, c => {
    return Math.floor(Math.random() * 16).toString(16)
  })

class Poller extends React.Component {
  state = {
    poller: null,
    channels: {
      // [`/recruit_${this.props.contactId}`]: -1
      [`/contact_${this.props.contactId}_coach_${this.props.currentStaff.id}`]: -1,
    },
    source: axios.CancelToken.source(),
  }

  componentDidMount() {
    this.poll()
  }

  componentWillUnmount() {
    clearTimeout(this.state.poller)
    this.state.source.cancel('poller canceled')
  }

  startPoll = () => {
    this.setState({ poller: setTimeout(this.poll, 10000) })
  }

  poll = () => {
    this.messageBus()
      .then(messages => {
        this.processMessages(messages)
        this.startPoll()
      })
      .catch(thrown => {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message)
        } else {
          this.startPoll()
        }
      })
  }

  messageBus = () => {
    return this.sendRequest(
      BASE_URL + `/message-bus/${messageBusId}/poll?dlp=t`,
      'POST',
      this.state.channels
    )
  }

  processMessages = messages => {
    messages.forEach(message => {
      // const recruitChannel = `/recruit_${this.props.contactId}`
      const recruitChannel = `/contact_${this.props.contactId}_coach_${this.props.currentStaff.id}`
      if (this.channels) { // what does this do??
        this.setState({ channels: { ...this.state.channels, [message.channel]: message.message_id } })
      }
      if (message.channel === '/__status') {
        this.setState({ channels: { ...message.data, __seq: 0 } })
      } else if (message.channel === recruitChannel) {
        if (typeof message.data.status === 'object') {
          this.setState({ channels: { ...this.state.channels, [recruitChannel]: message.message_id } })
          this.props.dispatch({ type: UPDATE_CONVERSATION_ITEM, data: message.data.status })
        } else {
          this.props.dispatch({ type: APPEND_TO_CONVERSATION, data: message.data.message })
        }
      }
    })
  }

  sendRequest = (url, method, _data) => {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    let form_data = new FormData()
    for (let key in this.state.channels) {
      form_data.append(key, this.state.channels[key])
    }

    return new Promise((resolve, reject) => {
      const options = {
        method,
        headers,
        data: form_data,
        url,
        cancelToken: this.state.source.token,
      }
      axios(options)
        .then(r1 => {
          if (r1.status === 200) {
            return r1.data
          } else {
            throw new Error('Error during fetch status code: ' + r1.status)
          }
        })
        .then(result => {
          resolve(result)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  render() { return null }
}

Poller.propTypes = {
  contactId: PropTypes.string.isRequired,
  currentStaff: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

class MessageBus extends React.Component {
  state = { appState: AppState.currentState }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this.setState({ appState: nextAppState })
    } else if (nextAppState === 'background') {
      this.setState({ appState: nextAppState })
    }
  }

  render() {
    return this.state.appState === 'active' ? <Poller {...this.props} /> : null
  }
}

export default connect()(MessageBus)
