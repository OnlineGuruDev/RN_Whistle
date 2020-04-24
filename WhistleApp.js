import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-native'
import { validateAuth, checkTokenComplete } from './actions/user'
import Loader from './components/shared/Loader'
import ManagerRoutes from './components/ManagerRoutes'
import CoachRoutes from './components/CoachRoutes'
import UnauthRoutes from './components/UnauthRoutes'
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { BASE_URL } from './reference/constants';

class WhistleApp extends React.Component {

  _isMounted = false;
  fcmOnTokenRefreshUnsubscribe = null;

  async componentDidUpdate() {
    //a new version of the app could be loaded post/after WhistleApp.componentDidMount
    await this.checkFlushv();
  }

  async componentWillUnmount() {
    console.log('WhistleApp componentWillUnmount');
    this.fcmOnTokenRefreshUnsubscribe();
    this.fcmOnTokenRefreshUnsubscribe = null;
  }

  async componentDidMount() {
    console.log('*************** WhistleApp componentDidMount *************');
    try {

      await this.authCheck();
      await this.configureFirebaseCloudMessaging();

      // Crashlytics time
      console.log('==== login complete====');
      console.log('==== add crashlytics info====');
      const uid = await AsyncStorage.getItem('uid');
      const client = await AsyncStorage.getItem('client');
      const accessToken = await AsyncStorage.getItem('access-token');
      const fcmToken = await AsyncStorage.getItem('fcmToken');

      firebase.crashlytics().log('whiste-native');
      firebase.crashlytics().log(`uid: ${uid}`);
      firebase.crashlytics().log(`client: ${client}`);
      firebase.crashlytics().log(`access-token: ${accessToken}`);
      firebase.crashlytics().log(`fcmToken: ${fcmToken}`);

    } catch (error) {
      console.log('******************** WhistleApp componentDidLoad error ***********', error);
    }
  }

  authCheck = async () => {
    let token = await AsyncStorage.getItem('access-token')

    if (token !== null && token !== undefined) {
      await this.props.validateAuth()
      this.props.checkTokenComplete()
    } else {
      this.props.checkTokenComplete()
    }
  }

  configureFirebaseCloudMessaging = async () => {
    //wire up Firebase Cloud Messaging onTokenRefresh listener

    this.fcmOnTokenRefreshUnsubscribe = await firebase.messaging().onTokenRefresh(async fcmToken => {
      console.log('*********************** onTokenRefresh *****************');
      //this is callBack called typically sometime in the future but can be call with app loaded but user not logged in
      //check for that case and exit if there is no accessToken to call APIs
      const accessToken = await AsyncStorage.getItem('access-token');
      if (!accessToken) {
        console.log('************** user is not logged in exit onTokenRefresh do not register device ************');
        return;
      }
      await this.registerDevice(fcmToken, BASE_URL);
      await AsyncStorage.setItem('fcmToken', fcmToken);
      firebase.crashlytics().log(`flushed new fcmToken: ${fcmToken}`);
      console.log('***************** success whistle account updated with latest token **************');
    });

    //Firebase Cloud Messaging time
    await this.requestPushPermission();
    await this.checkFlushv();
  }

  checkFlushv = async () => {
    let FLUSHV = `${DeviceInfo.getVersion()}-build-${DeviceInfo.getBuildNumber()}`;

    const flush = await AsyncStorage.getItem(FLUSHV);
    console.log('======= checking FLUSHV=========', flush);
    if (flush) {
      console.log('***** device token already been flushed ******');
      return;
    }

    const accessToken = await AsyncStorage.getItem('access-token');
    console.log('flushy access token:', accessToken);
    if (!accessToken) {
      console.log('******** user is not logged in do not flush ************');
      return;
    }

    //force push notifications, this will fire onTokenRefresh callback
    await firebase.iid().delete();

    //iterate all keys and remove other builds to keep tidy and TestFlighters possibly going up and back down build versions for testing
    const keys = await AsyncStorage.getAllKeys();
    const buildKeys = keys.filter(key => {
      return key.indexOf('build') !== -1;
    });
    await AsyncStorage.multiRemove(buildKeys);

    //add current build key so no more flushy
    await AsyncStorage.setItem(FLUSHV, FLUSHV);
    console.log(`=================FLUSHV clear: ${FLUSHV}===================`)
  }

  registerDevice = async (token, baseUrl) => {
    console.log(`******** registerDevice token: ${token}, baseUrl: ${baseUrl}`);
    let data = {
      device: 'firebase',
      token: token
    }

    //register token with whistle account
    axios.post(`${baseUrl}/api/v1/staffs/register_device`, data)
      .then(response => {
        return {}
      })
      .catch(err => {
        console.log(err)
        return {}
      })
  }

  requestPushPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorized
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  trafficController = () => {
    if (this.props.user.isLoggedIn) {
      switch (this.props.user.kind) {
        case "manager":
          return <ManagerRoutes />
        case "coach":
          return <CoachRoutes />
        default:
          return <UnauthRoutes />
      }
    } else {
      return <UnauthRoutes />
    }
  }

  render() {
    // if (!this.props.user.tokenChecked || this.props.user.isFetchingAuth) { return <Loader/> }
    if (!this.props.user.tokenChecked) { return <Loader /> }
    return this.trafficController()
  }
}

WhistleApp.propTypes = {
  user: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  user: state.user,
})

export default withRouter(connect(mapStateToProps, {
  validateAuth,
  checkTokenComplete,
})(WhistleApp))
