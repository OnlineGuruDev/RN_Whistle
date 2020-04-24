/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import MyShareEx from './MyShareEx'

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('MyShareEx', () => MyShareEx)

if (Platform.OS === 'web') {
    const rootTag = document.getElementById('root') || document.getElementById('main');
    AppRegistry.runApplication(appName, { rootTag });
}