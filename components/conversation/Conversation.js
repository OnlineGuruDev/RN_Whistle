import React, { PureComponent } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { StyleSheet, View, FlatList } from 'react-native'
import { withRouter } from 'react-router-native'

import { loadContactConversation, getMessagePreview } from '../../actions/conversation'
import { clearCurrentContact } from '../../actions/currentContact'
import { createMessage } from '../../actions/messages'
import { setFlash } from '../../actions/flash'
import { getConversationOrdered, getLastConvItemKind } from '../../selectors/activitySelectors'

import ConversationItem from './ConversationItem'
import Header from '../shared/Header'
import Loader from '../shared/Loader'
import ListLoader from '../shared/ListLoader'
import InputBar from '../shared/inputbar/InputBar'
import PreviewMessage from './PreviewMessage'
import MessageBus from '../shared/MessageBus'

class Conversation extends PureComponent {
  state = {
    datetime: new Date(),
    isScheduled: false,
    loadingPreview: false,
    media: '',
    mediaType: '',
    mediaFileName: '',
    messageText: '',
    messageType: 'message',
    storageFileId: null,
    page: 1,
    previewing: false,
    submitting: false,
    source: axios.CancelToken.source(),
  }

  componentDidMount() {
    const { currentStaff, loadContactConversation } = this.props
    loadContactConversation(this.props.match.params.contactId, currentStaff.id, null, null, this.state.source)
      .then(res => {
        if (res.ok) this.updateMessageType()
      })
  }

  componentDidUpdate(prevProps) {
    const { match, currentStaff, conversation, loadContactConversation } = this.props
    if ((prevProps.match.params.contactId !== match.params.contactId) || (prevProps.currentStaff.id !== currentStaff.id)) {
      loadContactConversation(match.params.contactId, currentStaff.id, null, null, this.state.source)
        .then(res => {
          if (res.ok) this.updateMessageType()
        })
    }
    if (prevProps.conversation.length !== conversation.length) {
      this.updateMessageType()
    }
  }

  componentWillUnmount() {
    this.props.clearCurrentContact()
    this.state.source.cancel('Request canceled on unmount.')
  }

  updateMessageType = (kind) => {
    const { conversation, currentStaff, lastItemKind } = this.props
    if (kind === undefined) {
      if (conversation.length == 0) {
        kind = currentStaff.default_send_method
      }
      else {
        kind = lastItemKind
      }
    }
    const kindCheck = this.props.currentStaff.team_social_permission ? kind : 'message'
    this.setState({ messageType: kindCheck })
  }

  fetchMoreConversation = () => {
    const { canLoadMore, currentStaff, match, loadingMore, loadContactConversation } = this.props
    if (!canLoadMore || loadingMore) return
    const newPage = this.state.page + 1
    this.setState({ page: newPage })
    loadContactConversation(match.params.contactId, currentStaff.id, newPage, null, this.state.source)
      .then(res => {
        this.list.flashScrollIndicators()
      })
  }

  scheduleMessage = () => this.setState({ isScheduled: !this.state.isScheduled })

  addMedia = result => {
    let mediaFileName = result.uri.split('/').pop()
    console.log('media file name', mediaFileName);
    this.setState({ media: result.uri, mediaType: result.type, mediaFileName, storageFileId: null, previewing: false })
  }

  insertTextAtCursor = (text, { start, end }) => {
    this.setState(s => {
      const messageText = s.messageText.substring(0, start) + text + s.messageText.substring(end, s.messageText.length)
      return { messageText, previewing: false }
    })
  }

  prependMessageText = text => this.setState(s => ({ messageText: `${text}${s.messageText}`, previewing: false }))

  addStorageFile = id => this.setState({ storageFileId: id, media: '', mediaType: '', mediaFileName: '', previewing: false })

  removeMedia = () => this.setState({ storageFileId: null, media: '', mediaType: '', mediaFileName: '', previewing: false })

  onSend = () => {
    const { messageText, media, mediaType, mediaFileName, isScheduled, datetime, messageType, storageFileId } = this.state
    const { createMessage, setFlash, currentStaff, currentContact } = this.props
    if (!messageText.trim() && media.length === 0 && !storageFileId) return
    this.setState({ submitting: true, previewing: false })
    let data = new FormData()
    data.append('message[to]', currentContact.data.id)
    data.append('message[body]', messageText)
    data.append('message[kind]', messageType)
    data.append('message[single]', true)
    data.append('message[storage_file_id]', storageFileId)
    if (isScheduled) data.append('message[schedule_at]', datetime.toISOString())
    if (media.length > 0) {
      const attachment = {
        uri: media,
        type: `${mediaType}/*`,
        name: mediaFileName,
      }
      data.append('message[attach]', attachment)
    }
    createMessage(data, currentStaff.id)
      .then(res => {
        if (res.ok) {
          // handle if component unmounts
          this.setState({
            messageText: '',
            isScheduled: false,
            media: '',
            mediaType: '',
            mediaFileName: '',
            storageFileId: null,
            submitting: false,
          })
        } else {
          this.setState({ submitting: false })
          if (res.error && res.error.response && res.error.response.data && res.error.response.data.message) {
            setFlash(res.error.response.data.message)
          } else {
            setFlash('There was a problem sending the message.')
          }
        }
      })
  }

  setSchedule = date => this.setState({ isScheduled: true, datetime: date, previewing: false })

  cancelSchedule = () => this.setState({ isScheduled: false, datetime: new Date(), previewing: false })

  updateMessageText = text => this.setState({ messageText: text, previewing: false })

  renderConversationItem = ({ item }) => <ConversationItem item={item} contact={this.props.currentContact.data} />

  toProfile = () => this.props.history.push(`/profile/${this.props.currentContact.data.id}`)

  closePreview = () => this.setState({ previewing: false })

  viewPreview = () => {
    if (this.state.previewing) return this.closePreview()
    const { messageText, isScheduled, datetime, media, storageFileId } = this.state
    if (!messageText && media.length === 0 && !storageFileId) return
    this.setState({ previewing: true, loadingPreview: true })
    const data = {
      to: `${this.props.currentContact.data.id}`,
      body: messageText,
      attachment: media,
      storage_file_id: storageFileId,
    }
    if (isScheduled) data.schedule_at = datetime
    this.props.getMessagePreview(data, this.props.currentStaff.id)
      .then(res => {
        if (res.ok) {
          this.setState({ loadingPreview: false })
        } else {
          this.setState({ loadingPreview: false, previewing: false })
          this.props.setFlash('Failed to get preview.')
        }
      })
  }

  backToMessages = () => this.props.history.push('/messages')

  render() {
    const { conversation, loadingMore, isLoaded, currentContact, preview, currentStaff } = this.props
    const { datetime, isScheduled, messageText, submitting, previewing, media, loadingPreview, storageFileId } = this.state
    const title = currentContact.data.title || ''
    return (
      <View style={styles.conversationView}>
        <Header
          title={title}
          subTitle={currentStaff}
          backButton
          leftAction={this.backToMessages}
          rightAction={this.toProfile}
          rightIcon='md-person' />
        <View>{loadingMore && <ListLoader top />}</View>
        {isLoaded
          ? <FlatList
            keyboardShouldPersistTaps='handled'
            ref={list => { this.list = list }}
            inverted
            data={conversation}
            keyExtractor={item => `${item.id}`}
            onEndReached={this.fetchMoreConversation}
            onEndReachedThreshold={0.1}
            renderItem={this.renderConversationItem}
            ListHeaderComponent={(loadingPreview || previewing) &&
              <PreviewMessage
                loading={loadingPreview}
                preview={preview}
                media={media}
                closePreview={this.closePreview}
                messageType={this.state.messageType}
              />
            } />
          : <Loader />
        }
        <InputBar
          insertTextAtCursor={this.insertTextAtCursor}
          prependMessageText={this.prependMessageText}
          addImage={this.addMedia}
          cancelSchedule={this.cancelSchedule}
          createMessage={this.onSend}
          datetime={datetime}
          hasMedia={!!storageFileId || media.length > 0}
          isScheduled={isScheduled}
          messageText={messageText}
          previewFunction={this.viewPreview}
          previewing={previewing}
          scheduleMessage={this.scheduleMessage}
          setSchedule={this.setSchedule}
          submitting={submitting}
          updateText={this.updateMessageText}
          messageType={this.state.messageType}
          updateMessageType={this.updateMessageType}
          socialPermission={this.props.currentStaff.team_social_permission || false}
          addStorageFile={this.addStorageFile}
          removeMedia={this.removeMedia}
        />
        <MessageBus
          contactId={this.props.match.params.contactId}
          currentStaff={this.props.currentStaff}
        />
      </View>
    )
  }
}

Conversation.propTypes = {
  canLoadMore: PropTypes.bool.isRequired,
  conversation: PropTypes.array.isRequired,
  createMessage: PropTypes.func.isRequired,
  clearCurrentContact: PropTypes.func.isRequired,
  currentContact: PropTypes.object.isRequired,
  currentStaff: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  loadContactConversation: PropTypes.func.isRequired,
  getMessagePreview: PropTypes.func.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  preview: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  setFlash: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  lastItemKind: PropTypes.string,
}

const styles = StyleSheet.create({
  conversationView: {
    flex: 1,
  },
})

const mapStateToProps = state => ({
  canLoadMore: state.conversation.canLoadMore,
  conversation: getConversationOrdered(state),
  lastItemKind: getLastConvItemKind(state),
  currentContact: state.currentContact,
  currentStaff: state.currentStaff,
  isLoaded: state.conversation.isLoaded,
  loadingMore: state.conversation.loadingMore,
  preview: state.conversation.preview,
  user: state.user,
})

export default withRouter(
  connect(mapStateToProps, {
    setFlash,
    loadContactConversation,
    createMessage,
    getMessagePreview,
    clearCurrentContact,
  })(Conversation))
