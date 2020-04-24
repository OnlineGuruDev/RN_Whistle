import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
//import { Audio } from 'expo-av';
var Sound = require('react-native-sound');
import { withRouter } from 'react-router-native'
import { SectionList, StyleSheet, View } from 'react-native'

import { LOADING_MORE_VOICE_ACTIVITIES } from '../../actions/types'
import { loadVoiceActivities } from '../../actions/voiceActivities'
import { loadCallTags } from '../../actions/user'
import { getCallLog } from '../../selectors/logSelectors'
import { BASE_URL } from '../../reference/constants'

import VoicemailBar from './VoicemailBar'
import CallTags from './CallTags'
import Loader from '../shared/Loader'
import SelectCoach from '../shared/SelectCoach'
import SectionHeader from '../shared/SectionHeader'
import VoiceItem from './VoiceItem'

class Log extends React.Component {
  state = {
    page: 1,
    modalVisible: false,
    selectedCall: {},
    voiceBarVisible: false,
    voicemailSender: '',
    auidioFile: null,
  }

  componentDidMount() {
    const { currentStaff, dispatch } = this.props
    if (currentStaff.kind === "coach") {
      dispatch(loadVoiceActivities(currentStaff.id, 1))
    }
    dispatch(loadCallTags())
  }

  componentDidUpdate(prevProps) {
    const { currentStaff, dispatch } = this.props
    if (prevProps.currentStaff.id !== currentStaff.id) {
      dispatch(loadVoiceActivities(currentStaff.id, 1))
    }
  }

  listenToVoicemail = async (call) => {
    const sound = new Sound()//new Audio.Sound()

    await sound.loadAsync({ uri: `${BASE_URL}${call.voicemail_url}`})
    this.setState({
      voiceBarVisible: true,
      voicemailSender: call.contact.title,
      audioFile: sound,
    })
  }

  fetchMore = () => {
    const { canLoadMore, currentStaff, loadingMore, dispatch } = this.props
    if (!canLoadMore || loadingMore) return
    dispatch({type: LOADING_MORE_VOICE_ACTIVITIES})
    const newPage = this.state.page + 1
    this.setState({page: newPage})
    dispatch(loadVoiceActivities(currentStaff.id, newPage))
  }

  selectCall = call => this.setState({selectedCall: call, modalVisible: true})

  selectProfile = contact => this.props.history.push(`/profile/${contact.id}`)

  closeTagModal = () => this.setState({modalVisible: false})

  closeVoicemailBar = () => this.setState({voiceBarVisible: false})

  render() {
    const { calls, isLoaded, currentStaff, user, callTags } = this.props
    const { voiceBarVisible, audioFile, voicemailSender } = this.state
    if (!currentStaff.id) return <SelectCoach pageName="Call Log"/>
    if (!isLoaded) return <Loader/>
    return (
      <View style={styles.view}>
        { voiceBarVisible && <VoicemailBar audioFile={audioFile} voicemailSender={voicemailSender} closeVoicemailBar={this.closeVoicemailBar} /> }
        { calls &&
          <View style={styles.view}>
            <SectionList
              keyboardShouldPersistTaps='handled'
              renderItem={({item}) =>
                <VoiceItem
                  callTags={callTags}
                  selectCall={this.selectCall}
                  listenToVoicemail={this.listenToVoicemail}
                  call={item}
                  selectProfile={this.selectProfile}
                />
              }
              renderSectionHeader={headerItem => <SectionHeader text={headerItem.section.title} />}
              sections={calls}
              stickySectionHeadersEnabled={true}
              onEndReached={this.fetchMore}
              onEndReachedThreshold={0.1}
              keyExtractor={item => `${item.id}`}
            />
          </View>
        }
        <CallTags
          call={this.state.selectedCall}
          tags={user.call_tags}
          modalVisible={this.state.modalVisible}
          close={this.closeTagModal}
        />
      </View>
    )
  }
}

Log.propTypes = {
  calls: PropTypes.array.isRequired,
  callTags: PropTypes.object.isRequired,
  canLoadMore: PropTypes.bool.isRequired,
  currentStaff: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
})

const mapStateToProps = (state) => {
  return {
    calls: getCallLog(state),
    canLoadMore: state.voiceActivities.canLoadMore,
    user: state.user,
    currentStaff: state.currentStaff,
    isLoaded: state.voiceActivities.isLoaded,
    loadingMore: state.voiceActivities.loadingMore,
    callTags: state.user.raw_call_tags
  }
}

export default withRouter(connect(mapStateToProps)(Log))
