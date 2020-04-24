import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import {
  getMessagePreview,
  updateMMForm,
  clearPreview,
  submittingMassMessage,
  removeMedia,
} from '../../actions/massMessages'

import InputBar from '../shared/inputbar/InputBar'
import Header from '../shared/Header'
import PreviewEdit from './PreviewEdit'
import RecipientsBanner from '../shared/RecipientsBanner'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

const MassMessageTemplate = ({
  recipients,
  scheduleDateTime,
  schedule,
  localAttachment,
  storage_file_id,
  body,
  kind,
  from,
  submitting,
  updateMMForm,
  preview,
  clearPreview,
  currentStaff,
  createMessageAction,
  getMessagePreview,
  newMessageRoute,
  title,
  noPreview,
  attachment,
  noCancelSchedule,
  removeMedia,
}) => {
  const insertTextAtCursor = (text, { start, end }) => {
    const messageText = body.substring(0, start) + text + body.substring(end, body.length)
    updateMMForm('body', messageText)
    clearPreview()
  }

  const prependMessageText = text => {
    updateMMForm('body', `${text}${body}`)
    clearPreview()
  }

  const setSchedule = date => {
    clearPreview()
    updateMMForm('schedule', true)
    updateMMForm('scheduleDateTime', date.toISOString())
  }

  const cancelSchedule = () => {
    clearPreview()
    updateMMForm('schedule', false)
    updateMMForm('scheduleDateTime', new Date().toISOString())
  }

  const addMedia = result => {
    clearPreview()
    let mediaFileName = result.uri.split('/').pop()
    updateMMForm('attachment', '')
    updateMMForm('localAttachment', result.uri)
    updateMMForm('mediaType', result.type)
    updateMMForm('mediaFileName', mediaFileName)
    updateMMForm('storage_file_id', null)
  }

  const addStorageFile = id => {
    clearPreview()
    updateMMForm('storage_file_id', id)
    clearLocalAttachment()
    updateMMForm('attachment', '')
  }

  const clearLocalAttachment = () => {
    updateMMForm('localAttachment', '')
    updateMMForm('mediaFileName', '')
    updateMMForm('mediaType', '')
  }

  const updateText = text => {
    updateMMForm('body', text)
    clearPreview()
  }

  const updateKind = kind => {
    updateMMForm('kind', kind)
    clearPreview()
  }

  const viewPreview = () => {
    if (preview.length) return clearPreview()

    if (!body && !localAttachment && !storage_file_id) return
    const data = {
      to: recipients.toString(),
      body,
      kind,
      storage_file_id,
    }
    if (schedule) data.schedule_at = scheduleDateTime
    getMessagePreview(data, from)
  }

  return (
    <View style={styles.container}>
      <Header title={title} backButton={true} />
      <RecipientsBanner recipientCount={recipients.length}/>
      <PreviewEdit newMessageRoute={newMessageRoute}/>
      <InputBar
        insertTextAtCursor={insertTextAtCursor}
        prependMessageText={prependMessageText}
        addImage={addMedia}
        cancelSchedule={!noCancelSchedule && cancelSchedule} // add this
        createMessage={createMessageAction}
        datetime={new Date(scheduleDateTime)}
        hasMedia={!!localAttachment || !!attachment || !!storage_file_id}
        isScheduled={schedule}
        messageText={body}
        previewFunction={!noPreview && viewPreview}
        setSchedule={setSchedule}
        submitting={submitting}
        updateText={updateText}
        messageType={kind}
        updateMessageType={updateKind}
        socialPermission={currentStaff.team_social_permission || false}
        addStorageFile={addStorageFile}
        previewing={!!preview.length}
        removeMedia={removeMedia}
      />
    </View>
  )
}

MassMessageTemplate.propTypes = {
  currentStaff: PropTypes.object.isRequired,
  scheduleDateTime: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  recipients: PropTypes.array.isRequired,
  preview: PropTypes.array.isRequired,
  schedule: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  newMessageRoute: PropTypes.bool,
  noPreview: PropTypes.bool,
  noCancelSchedule: PropTypes.bool,
  from: PropTypes.number.isRequired,
  storage_file_id: PropTypes.number,
  localAttachment: PropTypes.string.isRequired,
  attachment: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  submittingMassMessage: PropTypes.func.isRequired,
  getMessagePreview: PropTypes.func.isRequired,
  updateMMForm: PropTypes.func.isRequired,
  clearPreview: PropTypes.func.isRequired,
  createMessageAction: PropTypes.func.isRequired,
  removeMedia: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
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
})

export default connect(mapStateToProps, {
  getMessagePreview,
  updateMMForm,
  clearPreview,
  submittingMassMessage,
  removeMedia,
})(MassMessageTemplate)
