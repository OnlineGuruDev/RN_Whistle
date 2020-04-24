import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'

import { createGroupMessage } from '../../actions/messages'
import { setFlash } from '../../actions/flash'
import { submittingMassMessage } from '../../actions/massMessages'

import MassMessageTemplate from './MassMessageTemplate'

const NewMassMessage = ({
  body,
  localAttachment,
  storage_file_id,
  recipients,
  kind,
  schedule,
  from,
  scheduleDateTime,
  mediaType,
  mediaFileName,
  setFlash,
  createGroupMessage,
  submittingMassMessage,
  history,
}) => {
  const createMessage = () => {
    if (!body && !localAttachment && !storage_file_id) return
    submittingMassMessage()
    let data = new FormData()
    data.append('message[to]', recipients.toString())
    data.append('message[body]', body)
    data.append('message[kind]', kind)
    data.append('message[storage_file_id]', storage_file_id)
    schedule && data.append('message[schedule_at]', scheduleDateTime)
    if (localAttachment.length > 0) {
      const newAttachment = { uri: localAttachment, type: `${mediaType}/*`, name: mediaFileName }
      data.append('message[attach]', newAttachment)
    }
    createGroupMessage(data, from)
      .then(res => {
        if (res.ok) {
          if (schedule) {
            history.push('/messenger/home')
          } else {
            history.push('/messages')
          }
        } else {
          if (res.error && res.error.response && res.error.response.data && res.error.response.data.message) {
            setFlash(res.error.response.data.message)
          } else {
            setFlash('There was a problem sending the message.')
          }
        }
      })
  }

  return (
    <MassMessageTemplate
      createMessageAction={createMessage}
      title='New Message'
      newMessageRoute
    />
  )
}

NewMassMessage.propTypes = {
  createGroupMessage: PropTypes.func.isRequired,
  setFlash: PropTypes.func.isRequired,
  submittingMassMessage: PropTypes.func.isRequired,
  body: PropTypes.string.isRequired,
  localAttachment: PropTypes.string.isRequired,
  recipients: PropTypes.array.isRequired,
  schedule: PropTypes.bool.isRequired,
  storage_file_id: PropTypes.number,
  from: PropTypes.number.isRequired,
  kind: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  mediaFileName: PropTypes.string.isRequired,
  scheduleDateTime: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return {
    body: state.massMessages.body,
    kind: state.massMessages.kind,
    schedule: state.massMessages.schedule,
    scheduleDateTime: state.massMessages.scheduleDateTime,
    attachment: state.massMessages.attachment,
    localAttachment: state.massMessages.localAttachment,
    mediaType: state.massMessages.mediaType,
    mediaFileName: state.massMessages.mediaFileName,
    storage_file_id: state.massMessages.storage_file_id,
    recipients: state.massMessages.recipients,
    from: state.currentStaff.id,
    currentStaff: state.currentStaff,
    preview: state.massMessages.preview,
    submitting: state.massMessages.submitting,
  }
}

export default withRouter(connect(mapStateToProps, {
  createGroupMessage,
  submittingMassMessage,
  setFlash,
})(NewMassMessage))
