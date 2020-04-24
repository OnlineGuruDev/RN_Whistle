import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'

import { updateMessage } from '../../actions/messages'
import { setFlash } from '../../actions/flash'
import {
  updateMMForm,
  getMessagePreview,
  submittingMassMessage,
  stopSubmittingMassMessage,
} from '../../actions/massMessages'

import MassMessageTemplate from './MassMessageTemplate'

const PreviewEditContainer = ({
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
  messageId,
  updateMMForm,
  updateMessage,
  submittingMassMessage,
  stopSubmittingMassMessage,
  getMessagePreview,
  setFlash,
}) => {
  const clearLocalAttachment = () => {
    updateMMForm('localAttachment', '')
    updateMMForm('mediaFileName', '')
    updateMMForm('mediaType', '')
  }

  const saveMessage = () => {
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
    updateMessage(data, messageId)
      .then(({ ok, message, error }) => {
        stopSubmittingMassMessage()
        if (ok) {
          clearLocalAttachment()
          getMessagePreview({
            to: message.to,
            body: message.body,
            attachment: message.attach.url,
            schedule_at: message.schedule_at,
            kind: message.kind,
            storage_file_id,
          }, message.from)
        } else {
          if (error && error.response && error.response.data && error.response.data.message) {
            setFlash(error.response.data.message)
          } else {
            setFlash('There was a problem updating the message.')
          }
        }
      })
  }

  return (
    <MassMessageTemplate
      createMessageAction={saveMessage}
      title='Edit Message'
      noPreview
      noCancelSchedule
    />
  )
}

PreviewEditContainer.propTypes = {
  updateMessage: PropTypes.func.isRequired,
  updateMMForm: PropTypes.func.isRequired,
  submittingMassMessage: PropTypes.func.isRequired,
  stopSubmittingMassMessage: PropTypes.func.isRequired,
  getMessagePreview: PropTypes.func.isRequired,
  setFlash: PropTypes.func.isRequired,
  body: PropTypes.string.isRequired,
  localAttachment: PropTypes.string.isRequired,
  recipients: PropTypes.array.isRequired,
  schedule: PropTypes.bool.isRequired,
  storage_file_id: PropTypes.number,
  from: PropTypes.number.isRequired,
  messageId: PropTypes.number.isRequired,
  kind: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  mediaFileName: PropTypes.string.isRequired,
  scheduleDateTime: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
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
  messageId: state.massMessages.id,
})

export default withRouter(connect(mapStateToProps, {
  updateMessage,
  updateMMForm,
  setFlash,
  submittingMassMessage,
  stopSubmittingMassMessage,
  getMessagePreview,
})(PreviewEditContainer))
