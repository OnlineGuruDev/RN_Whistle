import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AppState, Alert, View, NativeModules, TouchableOpacity, Text, Dimensions } from 'react-native'
import { withRouter } from 'react-router-native'
import firebase from 'react-native-firebase';

import { setCoachCurrentStaff } from '../actions/currentStaff'
import { markActivityRead } from '../actions/activities'
import { setFlash } from '../actions/flash'
import { APPEND_TO_CONVERSATION, APPEND_TO_ACTIVITIES } from '../actions/types'
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

    //this.notificationSubscription = Notifications.addListener(this.handleNotification)
  }

  componentWillUnmount() {
    //this.notificationSubscription.remove()
    this.notificationSubscription();
    this.notificationOpenedListener();
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = nextAppState => {
    //Notifications.setBadgeNumberAsync(0)
    firebase.notifications().setBadge(0)
    this.setState({ appState: nextAppState })
  }

  pushToConversation = activity => {
    const { dispatch, history } = this.props
    dispatch(setCoachCurrentStaff(activity.staff))
    history.push(`/messages/conversation/${activity.contact.id}`)
  }

  handleMessage = notification => {
    const { dispatch, history, currentStaff } = this.props
    const { data, origin } = notification

    if (origin === 'received') { // push notification is recieved by application, but not via the user tapping the notification
      if (currentStaff.id === data.activity.staff.id) { // selectedCoach is the same as the push activity staff
        if (history.location.pathname === `/messages/conversation/${data.activity.contact.id}`) { // user is on conversation page of push activity contact
          dispatch(markActivityRead(data.activity.id))
          dispatch({ type: APPEND_TO_CONVERSATION, data: data.activity })
          return
        }
        if (history.location.pathname === '/messages/home') {
          dispatch({ type: APPEND_TO_ACTIVITIES, data: data.activity })
          return
        }
      }

      if (this.state.appState === 'active') { // catch all for if the user is in the app but above don't apply
        dispatch(setFlash(`${data.title} - ${data.activity.body}`, () => this.pushToConversation(data.activity)))
        return
      }
    }

    if (origin === 'selected') { // if the push notification is tapped
      this.pushToConversation(data.activity)
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
      case 'imessage':
        return this.sendiMessage(data)
    }
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
  }
}

PushNotifications.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  currentStaff: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  currentStaff: state.currentStaff,
})

export default withRouter(connect(mapStateToProps)(PushNotifications))
