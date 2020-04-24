import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'
import {
  FlatList,
  Alert,
} from 'react-native'

import { getMessagePreview, setMMFormFromPreview, resetMMForm } from '../../actions/massMessages'
import { removeMessage } from '../../actions/messages'
import { BASE_URL } from '../../reference/constants'

import Loader from '../shared/Loader'
import SelectCoach from '../shared/SelectCoach'
import MsgScreen from '../shared/MsgScreen'
import ScheduledItem from './ScheduledItem'

class Scheduled extends React.Component {
  state = {
    isLoaded: false,
    messages: [],
    source: axios.CancelToken.source(),
  }

  componentDidMount = () => {
    const { currentStaff, resetMMForm } = this.props
    if (currentStaff.id) this.getMessages(currentStaff.id)
    resetMMForm()
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.currentStaff.id && prevProps.currentStaff.id !== this.props.currentStaff.id) {
      this.getMessages(this.props.currentStaff.id)
    }
  }

  componentWillUnmount() {
    this.state.source.cancel('poller canceled')
  }

  getMessages = id => {
    console.log('getting messages!')
    axios.get(`${BASE_URL}/api/v2/messages/scheduled`, {
      headers: { onbehalf: id },
      cancelToken: this.state.source.token,
    })
      .then(({ data }) => {
        this.setState({ isLoaded: true, messages: data.scheduled })
      })
      .catch(thrown => {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message)
        } else {
          this.setState({ isLoaded: true })
        }
      })
  }

  removeMessage = (sId, currentStaffId) => {
    Alert.alert('Confirm', 'Delete scheduled message?',
      [
        { text: 'Cancel' },
        { text: 'OK',
          onPress: () => {
            this.props.removeMessage(sId, currentStaffId)
              .then(res => res.ok && this.setState(prevState => ({ messages: prevState.messages.filter(m => m.id != sId) }))) // eslint-disable-line eqeqeq
          },
        },
      ]
    )
  }

  viewPreview = (message) => {
    const { history, currentStaff, getMessagePreview, setMMFormFromPreview } = this.props
    const schedule = message.schedule_at
    const attachment = message.media
    const data = {
      to: message.to,
      body: message.body,
      attachment,
      schedule_at: message.schedule_at,
      kind: message.kind,
      storage_file_id: message.storage_file_id,
    }
    history.push('/messenger/preview-edit')
    getMessagePreview(data, currentStaff.id)
      .then(res => {
        if (res.ok) {
          const recipients = res.data.messages.map(m => m.to.id)
          setMMFormFromPreview(recipients, schedule, attachment, message.body, true, message.id, message.kind, message.storage_file_id)
        }
      })
  }

  render() {
    const { currentStaff } = this.props
    if (!currentStaff.id) return <SelectCoach pageName='Scheduled Messages' />
    if (!this.state.isLoaded) return <Loader />
    if (!this.state.messages.length) return <MsgScreen message="No scheduled messages."/>
    return (
      <FlatList
        keyboardShouldPersistTaps='handled'
        data={this.state.messages}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) =>
          <ScheduledItem
            key={item.id}
            sI={item}
            viewPreview={this.viewPreview}
            removeMessage={this.removeMessage}
            currentStaff={currentStaff}
          />
        }
      />
    )
  }
}

Scheduled.propTypes = {
  currentStaff: PropTypes.object.isRequired,
  getMessagePreview: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  removeMessage: PropTypes.func.isRequired,
  setMMFormFromPreview: PropTypes.func.isRequired,
  resetMMForm: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    currentStaff: state.currentStaff,
  }
}

export default withRouter(connect(mapStateToProps, {
  removeMessage,
  getMessagePreview,
  setMMFormFromPreview,
  resetMMForm,
})(Scheduled))
