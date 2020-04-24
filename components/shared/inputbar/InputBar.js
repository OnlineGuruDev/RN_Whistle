import React from 'react'
import PropTypes from 'prop-types'
import { View, TextInput, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native'
//import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons'
import MIcon from 'react-native-vector-icons/MaterialIcons'; 
import FIcon from 'react-native-vector-icons/FontAwesome'; 
import EIcon from 'react-native-vector-icons/Entypo'; 

import { Preview, Messages } from '../../../images/SVGImages'
import { COLORS } from '../../../reference/constants'
import includes from 'ramda/src/includes'

import IdModalGroup from './IdModalGroup'
import ScheduleModal from './ScheduleModal'
import AttachMediaModal from './AttachMediaModal'
import StorageFilesModal from './StorageFilesModal'
import Touchable from '../Touchable'
import KeyboardView from '../KeyboardView'

const SendButton = ({
  isScheduled,
  submitting,
  createMessage,
  messageTypeColor,
}) => {
  if (submitting) return <View style={styles.spinner}><ActivityIndicator color={messageTypeColor} animating size='small' /></View>
  return (
    <Touchable onPress={createMessage}>
      <View style={styles.send}>
        {isScheduled
          ? <MIcon name='save' color={messageTypeColor} size={45} />
          : <FIcon name='arrow-circle-up' color={messageTypeColor} size={45} />}
      </View>
    </Touchable>
  )
}

SendButton.propTypes = {
  isScheduled: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  createMessage: PropTypes.func.isRequired,
  messageTypeColor: PropTypes.string.isRequired,
}

const PreviewButton = ({
  previewFunction,
  messageTypeColor,
  previewing,
}) => previewFunction
  ? (
    <Touchable onPress={previewFunction}>
      <View style={styles.send}>
        <Preview fill={previewing ? COLORS.WARNING_ORANGE : messageTypeColor} secondaryFill={COLORS.WHITE} size={30} />
      </View>
    </Touchable>)
  : null

PreviewButton.propTypes = {
  previewFunction: PropTypes.func.isRequired,
  messageTypeColor: PropTypes.string.isRequired,
  previewing: PropTypes.bool.isRequired,
}

const ToggleIcon = ({ toggle, topIcons }) => (
  <Touchable style={styles.showHideOptions} onPress={toggle}>
    <EIcon color={COLORS.GRAY} name={topIcons ? 'circle-with-plus' : 'circle-with-cross'} size={35} />
  </Touchable>
)

ToggleIcon.propTypes = {
  toggle: PropTypes.func.isRequired,
  topIcons: PropTypes.bool.isRequired,
}

class InputBar extends React.Component {
  state = {
    topIcons: true,
    showTop: true,
    animateUp: new Animated.Value(0),
    topViewO: new Animated.Value(1),
    bottomViewO: new Animated.Value(0),
    sFModalOpen: false,
    cursor: {},
  }

  toggleIcons = () => {
    !this.state.topIcons && this.setState({ showTop: true })
    this.setState(prevState => ({ topIcons: !prevState.topIcons }),
      () => {
        const value = this.state.topIcons ? 0 : -50
        const tO = this.state.topIcons ? 1 : 0
        const bO = this.state.topIcons ? 0 : 1
        Animated.parallel([
          Animated.timing(
            this.state.animateUp,
            {
              toValue: value,
              duration: 300,
            }
          ),
          Animated.timing(
            this.state.topViewO,
            {
              toValue: tO,
              easing: this.state.topIcons ? Easing.in(Easing.cubic) : Easing.out(Easing.cubic),
              duration: 400,
            }
          ),
          Animated.timing(
            this.state.bottomViewO,
            {
              toValue: bO,
              easing: this.state.topIcons ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
              duration: 400,
            }
          ),
        ]).start(() => { !this.state.topIcons && this.setState({ showTop: false }) })
      })
  }

  pickColor = () => {
    switch (this.props.messageType) {
      case 'message':
        return COLORS.LIGHT_GREEN
      case 'twitter_dm':
        return COLORS.TWITTER_LIGHT
      case 'imessage':
        return COLORS.IMESSAGE_LIGHT
      default:
        return COLORS.GRAY
    }
  }

  closeSFModal = () => this.setState({ sFModalOpen: false })
  openSFModal = () => this.setState({ sFModalOpen: true })

  handleSFPress = (file) => {
    if (includes('image', file.content_type) || includes('video', file.content_type)) {
      this.props.addStorageFile(file.id)
    } else {
      this.insertAtCursor(file.storage_file_url)
    }
    this.closeSFModal()
  }

  insertAtCursor = tag => this.props.insertTextAtCursor(tag, this.state.cursor)

  handleSelectionChange = ({ nativeEvent: { selection } }) => this.setState({ cursor: selection })

  render() {
    return (
      <KeyboardView style={styles.messageForm}>
        <View style={[styles.inputContainer, { zIndex: 2 }]}>
          <TextInput
            multiline
            underlineColorAndroid='transparent'
            value={this.props.messageText}
            style={styles.messageInput}
            onChangeText={this.props.updateText}
            onSelectionChange={this.handleSelectionChange}
            placeholder="Message..."
          />
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonContent}>
            { this.props.socialPermission && <ToggleIcon toggle={this.toggleIcons} topIcons={this.state.topIcons}/> }
            <View style={styles.buttonView}>
              <Animated.View style={[styles.buttonGroup, { zIndex: 1 }, { transform: [{ translateY: this.state.animateUp }], opacity: this.state.topViewO }] }>
                { this.state.showTop &&
                  <View style={styles.iconGroupRow}>
                    <IdModalGroup
                      addWIDTag={this.insertAtCursor} // passes cursor for inserting into specific location in message
                      addWIDPic={this.props.prependMessageText}
                      messageTypeColor={this.pickColor()}
                    />
                    <AttachMediaModal
                      hasMedia={this.props.hasMedia}
                      addImage={this.props.addImage}
                      removeMedia={this.props.removeMedia}
                      openSFModal={this.openSFModal}
                      messageTypeColor={this.pickColor()}
                    />
                    <StorageFilesModal
                      handleSFPress={this.handleSFPress}
                      visible={this.state.sFModalOpen}
                      close={this.closeSFModal}
                    />
                    <ScheduleModal
                      datetime={this.props.datetime}
                      isScheduled={this.props.isScheduled}
                      setSchedule={this.props.setSchedule}
                      cancelSchedule={this.props.cancelSchedule}
                      messageTypeColor={this.pickColor()}
                    />
                    <PreviewButton
                      previewFunction={this.props.previewFunction}
                      messageTypeColor={this.pickColor()}
                      previewing={this.props.previewing}
                    />
                  </View>
                }
              </Animated.View>
              <Animated.View style={[{ transform: [{ translateY: this.state.animateUp }] }, { opacity: this.state.bottomViewO }]}>
                <View style={styles.socialButtons}>
                  <Touchable onPress={() => this.props.updateMessageType('message')}>
                    <View>
                      <Messages
                        fill={this.props.messageType === 'message' ? COLORS.LIGHT_GREEN : COLORS.GRAY}
                        size={30}
                      />
                    </View>
                  </Touchable>
                  <Touchable onPress={() => this.props.updateMessageType('twitter_dm')}>
                    <FIcon
                      style={styles.twitterIcon}
                      name='twitter'
                      color={this.props.messageType === 'twitter_dm' ? COLORS.TWITTER_LIGHT : COLORS.GRAY}
                      size={32}
                    />
                  </Touchable>
                  <Touchable onPress={() => this.props.updateMessageType('imessage')}>
                    <FIcon
                      style={styles.twitterIcon}
                      name='apple'
                      color={this.props.messageType === 'imessage' ? COLORS.IMESSAGE_LIGHT : COLORS.GRAY}
                      size={32}
                    />
                  </Touchable>
                </View>
              </Animated.View>
            </View>
          </View>
          <SendButton
            isScheduled={this.props.isScheduled}
            submitting={this.props.submitting}
            createMessage={this.props.createMessage}
            messageTypeColor={this.pickColor()}
            socialPermission={this.props.socialPermission}
          />
        </View>
      </KeyboardView>
    )
  }
}

InputBar.propTypes = {
  prependMessageText: PropTypes.func.isRequired,
  insertTextAtCursor: PropTypes.func.isRequired,
  addImage: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  datetime: PropTypes.instanceOf(Date).isRequired,
  hasMedia: PropTypes.bool.isRequired,
  isScheduled: PropTypes.bool.isRequired,
  messageText: PropTypes.string.isRequired,
  messageType: PropTypes.string.isRequired,
  cancelSchedule: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  previewFunction: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  setSchedule: PropTypes.func.isRequired,
  socialPermission: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  previewing: PropTypes.bool.isRequired,
  updateMessageType: PropTypes.func.isRequired,
  updateText: PropTypes.func.isRequired,
  addStorageFile: PropTypes.func.isRequired,
  removeMedia: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  messageForm: {
    backgroundColor: COLORS.WHITE,
    flexDirection: 'column',
  },
  socialButtons: {
    flexDirection: 'row',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderColor: COLORS.GRAY,
    marginRight: 'auto',
  },
  iconGroupRow: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContent: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    marginBottom: 3,
  },
  buttonView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonGroup: {
    height: 50,
    flexDirection: 'row',
    marginBottom: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  twitterIcon: {
    marginLeft: 10,
  },
  send: {
    paddingRight: 10,
    paddingLeft: 5,
    justifyContent: 'center',
    // added to fix iOS 12 onPress/svg issue, see https://github.com/react-native-community/react-native-svg/issues/794
    overflow: 'hidden',
  },
  spinner: {
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  showHideOptions: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 5,
  },
  messageInput: {
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    paddingHorizontal: 9,
    flexGrow: 1,
    maxHeight: 100,
    minHeight: 30,
  },
})

export default InputBar
