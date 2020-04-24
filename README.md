## Using React-Native CLI
* all the basics you need are in package.json.scripts
    * npm run android
    * npm run ios
    * npm run start
    * npm build:ios //not really needed but had to one once for some error with mainbundle.js, done with Xcode -> Targets -> whistlenative -> Build Phases -> "Bundle React Native code and images" scripts

## The Libs Overview
* *Important to look at package-lock.json and Podfile.lock for specific version of libraries*
* Most important libs to know major versions we are on are:
    * React Native 0.61.5
    * React Native Firebase 5.6 (APIs to work with Firebase via React Native)
    * Firebase 6.15
* Don't forget about the Firebase Console and all the awesome things Firebase offers we are only using a few features:
    * https://console.firebase.google.com/
    * Firebase Cloud Messaging
        * Note FCM tracking received pushes doesn't really work for iOS (because of APNs middle man), only Android
    * Firebase Analytics
    * Firebase Crashlytics
        * Note Crashlytics requests dSYM for a build, just get dSYM zip right from App Store Connect
            * https://appstoreconnect.apple.com/
            * Whistle Recruiting App -> Activity -> Select Build - you will see link "Download dSYM" down the page right side

## Important Milestones and Known Issues
* iMessage Extension stable iOS 4.5 1-18-2020 (Brian Ogden)
    * iMessage Extension is native bridge and can show React Native components in that shim, this guide was heavily followed to setup although many things ended up being different as per usual with anything technical
        * https://dev.to/altay/we-built-an-imessage-extension-for-our-react-native-based-mobile-app-now-you-can-too-2387
* Push Notification Durablility across Logouts and App Updates iOS 4.5 (Brian Ogden)
    * Making sure that push notification registration with Firebase Cloud Messaging across app updates and login/logouts was quite a challenge, so archiving this research here: https://stackoverflow.com/questions/59796431/reset-push-notifications-device-registration-instance-id-app-update-via-testfl
* iMessage Bar App Icon intermittently displays
    * This is an iOS bug have tried multiple fixes to no avail
        * https://www.reddit.com/r/ios/comments/dltfym/imessage_app_bar_icon_not_showing/
* Messages app requires restart when there is an app version update in the App Store
    * this maybe because of the React Native bridge to the whistlenative components being loaded in the iMessage Extension

