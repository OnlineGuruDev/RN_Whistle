import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { View, StyleSheet, NativeModules} from 'react-native'
import { Switch, Route, Redirect, withRouter } from 'react-router-native'

import { setErrorFlash } from '../../actions/flash'

import { BASE_URL } from '../../reference/constants'

import SentMessages from './SentMessages'
import Header from '../shared/Header'
import ThreeTabs from '../shared/ThreeTabs'
const { RNMFMessageCompose} = NativeModules;
import take from 'ramda/src/take'
import Loader from '../shared/Loader'

class SentDetails extends React.Component {
  state = {
    messagesErrors: [],
    messagesSuccessful: [],
    messagesSending: [],
    isLoaded: false,
    refreshing: false,
    loading: false,
  }

  componentDidMount() {
    this.getMessages()
  }
  getMessages = () => {
    this.setState({ refreshing: true })
    axios.get(BASE_URL + `/api/v2/messages/${this.props.match.params.id}`, { headers: { onbehalf: this.props.currentStaff.id } })
      .then(({ data }) => {
        this.setState({
          messagesErrors: data.errored,
          messagesSuccessful: data.successful,
          messagesSending: data.sending,
          isLoaded: true,
          refreshing: false,
        })
      })
      .catch(err => {
        this.props.setErrorFlash(err)
        this.setState({ isLoaded: true, refreshing: false })
      })
  }

  resendMessage = activityId => {
    axios.post(`${BASE_URL}/api/v2/activities/${activityId}/resend`, {}, { headers: { onbehalf: this.props.currentStaff.id } })
      .then(({ data }) => {
        // moves message into sending
        this.setState(prevState => {
          const found = prevState.messagesErrors.find(m => m.id == activityId) // eslint-disable-line eqeqeq
          const toSending = found ? [ ...prevState.messagesSending, { ...found, status: 'sending', error_message: '', status_msg: '' } ] : prevState.messagesSending
          return {
            messagesErrors: prevState.messagesErrors.filter(m => m.id != activityId), // eslint-disable-line eqeqeq
            messagesSending: toSending,
          }
        })
      })
      .catch(err => {
        this.props.setErrorFlash(err)
      })
  }
  getAttachmentUrl = (attachments) => {
    return take(1, attachments).map((a, i) => {
      return a      
    })
  }
  resendiMessage = async (item) => {
    this.setState({loading: true})
    let a = this.getAttachmentUrl(item.attach_list)
    let fileType;
    const ext = a[0].match(/^[^?]*/)[0].split(".").pop().toLowerCase()
    if (ext === "mp4" || ext === "mov" || ext === "avi" || ext === "webm" || ext === "3gpp" || ext === "3gp")
      fileType = "video/" + ext
    else
      fileType = "image/png"
    return
    try {     
      const res = await RNMFMessageCompose.send({
        recipients: [item.contact.id],
        subject: 'Message',
        body: item.body,
        attachments: [{
          fileurl: a[0],
          filename: 'myimage',
          ext: '.' + ext,
          mimeType: fileType,
          text: 'This is a image',
        }],
      });
      this.setState({loading: false})
    } catch (e) {
      this.setState({loading: false})
      console.error('error', e);
    }
  }

  render() {
    const { refreshing, isLoaded, messagesErrors, messagesSending, messagesSuccessful, loading } = this.state
    const tab1Path = `/messenger/details/${this.props.match.params.id}/sent-success`
    const tab2Path = `/messenger/details/${this.props.match.params.id}/sent-errors`
    const tab3Path = `/messenger/details/${this.props.match.params.id}/sent-sending`
    if (loading) return <Loader />    
    return (
      <View style={styles.view}>
        <Header title='Sent Details' backButton />
        
        <ThreeTabs
          tab1Path={tab1Path}
          tab2Path={tab2Path}
          tab3Path={tab3Path}
          tab1={`Success (${this.state.messagesSuccessful.length})`}
          tab2={`Errors (${this.state.messagesErrors.length})`}
          tab3={`Sending (${this.state.messagesSending.length})`}
        />
        <Switch>
          <Route exact path="/messenger/details/:id" render={() => <Redirect to={tab1Path} />} />
          <Route path={tab1Path} render={() => <SentMessages resendMessage={this.resendMessage} getMessages={this.getMessages} refreshing={refreshing} isLoaded={isLoaded} messages={messagesSuccessful} />} />
          <Route path={tab2Path} render={() => <SentMessages resendMessage={this.resendMessage} getMessages={this.getMessages} refreshing={refreshing} isLoaded={isLoaded} messages={messagesErrors} resendiMessage={this.resendiMessage}/>} />
          <Route path={tab3Path} render={() => <SentMessages resendMessage={this.resendMessage} getMessages={this.getMessages} refreshing={refreshing} isLoaded={isLoaded} messages={messagesSending} />} />
        </Switch>
       
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

SentDetails.propTypes = {
  match: PropTypes.object.isRequired,
  currentStaff: PropTypes.object.isRequired,
  setErrorFlash: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    currentStaff: state.currentStaff,
  }
}

export default withRouter(connect(mapStateToProps, { setErrorFlash })(SentDetails))
