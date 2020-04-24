//
// App.iMessage.js
//

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  NativeEventEmitter,
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';

import firebase from 'react-native-firebase';
import WhistleiMessage from './WhistleiMessage'
import DevMenu from './DevMenu';
import ImageButton from './components/ImageButton';
const { PlatformConstants } = NativeModules;

const { MessagesManager, MessagesEventEmitter } = NativeModules;
const MessagesEvents = new NativeEventEmitter(MessagesEventEmitter);
const logoImg = require('./images/imessage_logo.png');
const playerImg = require('./images/imessage_player_profiles.png');
const graphicImg = require('./images/imsssage_graphic_storage.png');
const messageImg = require('./images/imsssage_message_templates.png');

export default class Apps extends React.Component {
  state = {
    email: '',
    presentationStyle: '',
    conversation: null,
    message: null,
    viewFlag: 0,
  }

  setViewIndex = (index) => {
    this.setState({ viewFlag: index })
  }

  MakeView = (flag) => {
    if (flag > 0)
      return (
        <WhistleiMessage type={flag} handleSFPress={this.handleSFPress} setViewIndex={this.setViewIndex} />
      )
    else
      return null
  }

  RenderMainView = (flag) => {
    if (flag > 0) return null
    return (
      <View>
        <View style={{ flexDirection: 'row', width: '100%', marginBottom: 20, marginTop: 20, justifyContent: 'center' }}>
          <ImageButton
            style={styles.logoContainer}
            imgstyle={styles.logoImage}
            img={logoImg}
            onPress={this.onOpenURL}
          />
        </View>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <ImageButton
            style={styles.ibuttonStyle}
            imgstyle={styles.iimgStyle}
            img={graphicImg}
            onPress={this.onGraphicView}
          />
          <ImageButton
            style={styles.ibuttonStyle}
            imgstyle={styles.iimgStyle}
            img={playerImg}
            onPress={this.onPlayerView}
          />
          <ImageButton
            style={styles.ibuttonStyle}
            imgstyle={styles.iimgStyle}
            img={messageImg}
            onPress={this.onMessageView}
          />
        </View>
      </View>
    );
  }
  componentDidMount() {
    MessagesManager
      .getPresentationStyle(presentationStyle => this.setState({ presentationStyle }))

    MessagesEvents
      .addListener('onPresentationStyleChanged', ({ presentationStyle }) => this.setState({ presentationStyle }));

    MessagesManager
      .getActiveConversation((conversation, message) => this.setState({ conversation, message }));

    MessagesEvents
      .addListener('didReceiveMessage', ({ message }) => this.setState({ message }));

    MessagesEvents
      .addListener('didSelectMessage', ({ message }) => this.setState({ message }));

    this.performFakeAsyncTaskAndHideLoadingView()
  }

  performFakeAsyncTaskAndHideLoadingView = () => {
    setTimeout(() => MessagesManager.hideLoadingView(), 1500);
  }

  onTogglePresentationStyle = () => {
    MessagesManager
      .updatePresentationStyle(this.state.presentationStyle === 'expanded' ? 'compact' : 'expanded')
      .then(presentationStyle => this.setState({ presentationStyle }))
  }

  onOpenURL = () => {
    MessagesManager.openURL('url://test')
      .then(() => console.log('Successfully opened url!'))
      .catch(error => console.log('An error occurred while opening the URL: ', error))
  }

  onShowLoadingView = () => {
    MessagesManager.showLoadingView();
    this.performFakeAsyncTaskAndHideLoadingView();
  }

  onGraphicView = () => {
    this.setState({ viewFlag: 1 })
    // MessagesManager
    //   .updatePresentationStyle(this.state.presentationStyle === 'expanded' ? 'compact' : 'expanded')
    //   .then(presentationStyle => this.setState({ presentationStyle, viewFlag: presentationStyle === 'expanded' ? 1: 0 }))
  }
  onGraphicViewClose = () => {
    this.setState({ viewFlag: 0 })
  }

  getFileExtension = (url) => {
    return url.split(/\#|\?/)[0].split('.').pop().trim();
  }

  getFileName = (url) => {
    if (!url) {
      return;
    }

    if (typeof url !== 'string') {
      return;
    }

    return url.split("?")[0].substring(url.lastIndexOf('/') + 1);
  }


  handleSFPress = (file) => {
    const url = file.storage_file_url
    const fileName = this.getFileName(url)

    MessagesManager.composeMessage({
      fileName: fileName,
      url: url
    })
      .then(() => MessagesManager.updatePresentationStyle('compact'))
      .catch(error => console.log('An error occurred while composing the message: ', error))
  }

  onPlayerView = () => {
    this.setState({ viewFlag: 2 })
  }

  onMessageView = () => {
    this.setState({ viewFlag: 3 })
  }

  render() {
    const { message, viewFlag } = this.state;

    return (
      <View style={styles.mainContainer}>
        {__DEV__ && <DevMenu />}

        {this.MakeView(viewFlag)}
        {this.RenderMainView(viewFlag)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    width: '80%',
  },
  logoImage: {
    width: '100%',
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ibuttonStyle: {
    width: '32%',
    alignItems: 'center',
  },
  iimgStyle: {
    width: '100%',
    height: 75,
    resizeMode: 'contain',
  },
});

