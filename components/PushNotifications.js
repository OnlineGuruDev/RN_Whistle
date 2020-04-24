import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AppState, Alert, View, NativeModules, TouchableOpacity, Text, Dimensions } from 'react-native'
import { withRouter } from 'react-router-native'
//import { Notifications } from 'expo'
// import firebase from 'react-native-firebase';
import firebase from 'react-native-firebase';
import { markActivityRead } from '../actions/activities'
import { loadContactConversation } from '../actions/conversation'
import { getMessagePreview, setMMFormFromPreview } from '../actions/massMessages'
import { setFlash } from '../actions/flash'
import { APPEND_TO_CONVERSATION, APPEND_TO_ACTIVITIES } from '../actions/types'
import { BASE_URL } from '../reference/constants'

import { getContactFieldsNoPics, getWidPicFields } from '../selectors/contactFieldsSelectors'
import { formattedContacts } from '../selectors/contactsSelectors'
import { loadContacts } from '../actions/contacts'
import axios from 'axios'

import PushList from './PushList'
const { RNMFMessageCompose } = NativeModules;
import Loader from './shared/Loader'

const deviceHeight = Dimensions.get('window').height


class PushNotifications extends React.Component {
  state = { notification: {}, appState: AppState.currentState, loading: false }

  async componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange)
    this.notificationSubscription = firebase.notifications().onNotification((message) => {
      this.handleNotification(message)
    });

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      console.log("From Message====================")
      console.log(notificationOpen.notification)
      this.handleNotification(notificationOpen.notification)

    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      this.handleNotification(notificationOpen.notification)
    }
  }

  componentWillUnmount() {
    //this.notificationSubscription.remove()
    this.notificationSubscription();
    this.notificationOpenedListener();
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = nextAppState => {
    //Notifications.setBadgeNumberAsync(0)
    firebase.notifications().setBadge(0);
    this.setState({ appState: nextAppState })
  }

  pushToConversation = activity => {
    console.log("=================activity====================")
    console.log(activity)
    this.props.history.push(`/messages/conversation/${activity.contact.id}`)
  }

  pushToEditMessage = message => {
    const data = {
      to: message.to,
      body: message.body,
      attachment: message.media,
      schedule_at: message.schedule_at,
      kind: message.kind,
      storage_file_id: message.storage_file_id,
    }
    this.props.history.push('/messenger/preview-edit')
    this.props.dispatch(getMessagePreview(data, message.staff_id))
      .then(res => {
        if (res.ok) {
          const recipients = res.data.messages.map(m => m.to.id)
          this.props.dispatch(setMMFormFromPreview(
            recipients,
            message.schedule_at,
            message.media,
            message.body,
            true,
            message.id,
            message.kind,
            message.storage_file_id,
          ))
        }
      })
  }

  handleMessage = ({ data, origin }) => {
    const { dispatch, history } = this.props
    if (origin === 'received') {
      if (history.location.pathname === `/messages/conversation/${data.activity.contact.id}`) {
        dispatch(markActivityRead(data.activity.id))
        dispatch({ type: APPEND_TO_CONVERSATION, data: data.activity })
      } else if (history.location.pathname === '/messages/home') {
        dispatch({ type: APPEND_TO_ACTIVITIES, data: data.activity })
      } else if (this.state.appState === 'active') {
        dispatch(setFlash(`${data.title} - ${data.activity.body}`, () => this.pushToConversation(data.activity)))
      }
    } else if (origin === 'selected') {
      if (history.location.pathname === `/messages/conversation/${data.activity.contact.id}`) {
        dispatch(loadContactConversation(data.activity.contact.id, data.activity.staff.id))
      } else {
        this.pushToConversation(data.activity)
      }
    }
  }

  handleVoice = notification => {
    // const { data, origin } = notification
    // if (origin === 'selected') {
    // TODO: should this history.push() to call logs or something?
    // so that the notification can do something if it's clicked later?
    // this.props.history.push('/phone/home')
    // }
  }

  handleScheduledMessageNotification = ({ data, origin }) => {
    if (origin === 'received') {
      this.props.dispatch(setFlash('Your message is going to send soon!', () => this.pushToEditMessage(data.message)))
    } else if (origin === 'selected') {
      this.pushToEditMessage(data.message)
    }
  }

  handleNotification = notification => {
    let data
    try {
      data = JSON.parse(notification.data.activity);
    } catch (e) {
      data = { body: "", phone_number: "", media: "" }
    }

    switch (notification.data.kind) {
      case 'voice':
        return this.handleVoice(notification)
      case 'message':
      case 'twitter_dm':
        return this.handleMessage(notification)
      case 'scheduled_message_notification':
        return this.handleScheduledMessageNotification(notification)
      case 'imessage':
        return this.sendiMessage(data)
    }
  }

  hideList = () => {
  }
  getBodyText = (messages, id) => {
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].contact.id === id) return i
    }
    return 0
  }
  sendiMessage = async (message) => {
    this.setState({ loading: true })
    this.setState({ loading: true })
    if (!message.body) message.body = ""
    if (!message.phone_number) message.phone_number = ""
    if (!message.media) message.media = ""
    axios.get(BASE_URL + `/api/v2/messages/${message.id}`, { headers: { onbehalf: message.staff_id } })
      .then(async ({ data }) => {
        // console.log("Messagelist==============================================" )
        // console.log(data)
        let bodytxt, afile = ''
        if (data.successful.length > 0) {
          bodytxt = data.successful[this.getBodyText(data.successful, message.contact_id)].body
          if (data.successful[this.getBodyText(data.successful, message.contact_id)].attach_list.length > 0)
            afile = data.successful[this.getBodyText(data.successful, message.contact_id)].attach_list[0]

        }
        else if (data.sending.length > 0) {
          bodytxt = data.sending[this.getBodyText(data.sending, message.contact_id)].body
          if (data.sending[this.getBodyText(data.sending, message.contact_id)].attach_list.length > 0)
            afile = data.sending[this.getBodyText(data.sending, message.contact_id)].attach_list[0]
        }
        if (afile === '') afile = message.media
        let item = { body: bodytxt, contactid: message.phone_number, fileurl: afile }
        let a = item.fileurl
        let fileType;
        const ext = a.match(/^[^?]*/)[0].split(".").pop().toLowerCase()
        if (ext === "mp4" || ext === "mov" || ext === "avi" || ext === "webm" || ext === "3gpp" || ext === "3gp")
          fileType = "video/" + ext
        else
          fileType = "image/png"

        try {
          const res = await RNMFMessageCompose.send({
            recipients: [item.contactid],
            subject: 'Message',
            body: item.body,
            attachments: [{
              fileurl: a,
              filename: 'myimage',
              ext: '.' + ext,
              mimeType: fileType,
              text: 'This is a image',
            }],
          });
          this.setState({ loading: false })
        } catch (e) {
          this.setState({ loading: false })
          console.error('error', e);
        }

      })
      .catch(err => {
        this.setState({ loading: false })
      })


  }

  render() {
    const { loading } = this.state
    if (loading) return (
      <View style={{ height: deviceHeight - 75 }}>
        <Loader />
      </View>
    )
    return null
    // return (
    //   <View style={{ height: deviceHeight-75}}>
    //     <MessageList hideList = {this.hideList} />
    //   </View>
    // )
  }
}

const mapStateToProps = state => ({
  wIDFields: getContactFieldsNoPics(state),
  wIDPicFields: getWidPicFields(state),
  contacts: formattedContacts(state),
  query: state.contacts.contactSearchQuery,
})

PushNotifications.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(connect(mapStateToProps)(PushNotifications))
