import React from 'react'
import { Alert } from 'react-native';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import DeviceInfo from 'react-native-device-info';
import { Platform, View, StyleSheet, ScrollView, Text } from 'react-native'

import { logout, updateUserData } from '../../actions/user'
import validateInput from '../../validation/settingsValidations'
import { isValid } from '../../reference/functions'
import { COLORS } from '../../reference/constants'

import { StaffAvatar } from '../shared/AvatarBubbles'
import PrimaryButton from '../shared/PrimaryButton'
import PrimaryInput from '../shared/PrimaryInput'
import KeyboardView from '../shared/KeyboardView'
import AddressBookContactsSettings from './AddressBookContactsSettings'
import firebase from 'react-native-firebase';

class Settings extends React.Component {

  state = {
    id: this.props.user.id,
    name: this.props.user.name || '',
    title: this.props.user.title || '',
    phone_number: this.props.user.phone_number || '',
    email: this.props.user.email || '',
    twitter_handle: this.props.user.twitter_handle || '',
    token: '',
    errors: {},
  }

  submit = () => {
    this.setState({ errors: {} })
    if (isValid(validateInput, this.state, (errors) => this.setState(errors))) {
      const { twitter_handle, email, phone_number, title, name, id } = this.state
      this.props.dispatch(updateUserData({ twitter_handle, email, phone_number, title, name, id }))
    }
  }

  loggingOut = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.props.dispatch(logout()) },
      ],
      { cancelable: false },
    );
  };

  setPushNotification = async () => {
    console.log('======setPushNotification touch!=========');
    await firebase.iid().delete();
  }
  render() {
    firebase.messaging().getToken().then((token) => {
      if (token) {
        this.setState({ token: token });
      }
    });

    const { user } = this.props
    const { name, email, phone_number, twitter_handle, title, token, errors } = this.state
    return (
      <View style={styles.view}>
        <View style={styles.outerAvatarView}>
          <StaffAvatar name={user.name} image={user.picture} />
          {user.twl_phone_number
            ? <Text style={styles.whistle_num}>WHISTLE No: {user.twl_phone_number}</Text>
            : null}
        </View>
        <KeyboardView style={styles.view}>
          <ScrollView keyboardShouldPersistTaps='handled'>
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Profile</Text>
            </View>
            <View style={styles.view}>
              <View style={styles.inputsContainer}>
                <PrimaryInput
                  editable={false}
                  required
                  label='Name'
                  onChangeText={v => this.setState({ name: v })}
                  autoCapitalize={'words'}
                  value={name}
                  error={errors.name}
                />
                <PrimaryInput
                  editable={false}
                  label='Title'
                  onChangeText={v => this.setState({ title: v })}
                  value={title}
                  error={errors.title}
                />
                <PrimaryInput
                  editable={false}
                  required
                  label='Phone'
                  onChangeText={v => this.setState({ phone_number: v })}
                  value={phone_number}
                  error={errors.phone_number}
                  keyboardType="phone-pad"
                />
                <PrimaryInput
                  editable={false}
                  required
                  label='Email'
                  onChangeText={v => this.setState({ email: v })}
                  value={email}
                  error={errors.email}
                  keyboardType="email-address"
                />
                <PrimaryInput
                  editable={false}
                  label='Twitter Handle'
                  onChangeText={v => this.setState({ twitter_handle: v })}
                  value={twitter_handle}
                />
                <PrimaryInput
                  editable={false}
                  label='Notification Token'
                  value={token}
                  onChangeText={v => console.log('token change')}
                />
              </View>
              {/* <View style={styles.buttonsContainer}>
                <PrimaryButton
                  action={this.submit}
                  spinner={this.props.submitting}
                  text='Submit Changes'
                  buttonStyle={styles.submitButton}
                />
              </View> */}
              {Platform.OS === 'ios' && user.kind === 'coach'
                ? <AddressBookContactsSettings />
                : null
              }
              <View style={styles.buttonsContainer}>
                <PrimaryButton
                  action={this.setPushNotification}
                  text='Reapply Notifications'
                  buttonStyle={styles.logoutButton}
                />
              </View>
              <View style={styles.buttonsContainer}>
                <PrimaryButton
                  action={this.loggingOut}
                  text='Log Out'
                  buttonStyle={styles.logoutButton}
                />
              </View>
              <View style={styles.version}>
                <Text style={styles.versionText}>Version: {DeviceInfo.getVersion()}</Text>
                {/* <Text style={styles.versionText}>Version: {Constants.manifest.version}</Text> */}
              </View>
            </View>
          </ScrollView>
        </KeyboardView>
      </View>
    )
  }
}

Settings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: 15,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY2,
  },
  header: {
    fontSize: 18,
    marginVertical: 3,
  },
  inputsContainer: {
    flex: 1,
    marginTop: 15,
    marginHorizontal: 15,
  },
  buttonsContainer: {
    alignItems: 'center',
  },
  outerAvatarView: {
    alignItems: 'center',
    backgroundColor: COLORS.DARKEST_GRAY,
    paddingVertical: 5,
  },
  whistle_num: {
    color: COLORS.WHITE,
    paddingTop: 5,
  },
  version: {
    marginTop: 20,
    marginBottom: 5,
    alignSelf: 'center',
  },
  versionText: {
    fontSize: 10,
    color: COLORS.GRAY,
  },
  submitButton: {
    marginTop: 0,
  },
  logoutButton: {
    backgroundColor: COLORS.LIGHT_GRAY2,
  },
})

const mapStateToProps = (state) => ({
  user: state.user,
  submitting: state.user.submitting,
})

export default connect(mapStateToProps)(Settings)
