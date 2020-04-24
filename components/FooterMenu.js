import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-native'
import { StyleSheet, Keyboard, Platform, View } from 'react-native'
import { COLORS } from '../reference/constants'
import Touchable from './shared/Touchable'
import { ListsO, Lists, Phone, PhoneO, Messages, MessagesO, Messenger, MessengerO, Settings, SettingsO } from '../images/SVGImages'

const buttons = [
    { path: 'phone', icon: PhoneO, activeIcon: Phone },
    { path: 'lists', icon: ListsO, activeIcon: Lists },
    { path: 'messages', icon: MessagesO, activeIcon: Messages },
    { path: 'messenger', icon: MessengerO, activeIcon: Messenger },
    { path: 'settings', icon: SettingsO, activeIcon: Settings },
  ]

const Button = ({history, path, active, children}) =>
  <Touchable
    style={[styles.button, active && styles.activeButton]}
    onPress={() => history.push('/' + path)}>
    <View style={[styles.button, active && styles.activeButton]}>
      {children}
    </View>
  </Touchable>

class FooterMenu extends React.Component {

  state = { hideFooter: false }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow = () => this.setState({hideFooter: true})

  _keyboardDidHide = () => this.setState({hideFooter: false})

  render() {
    if (this.state.hideFooter && Platform.OS === 'android') return null
    const firstSection = this.props.location.pathname.replace(/^\/([^\/]*).*$/, '$1')
    return (
        <View style={styles.footer}>
          {buttons.map(btn => {
            const Icon = btn.icon
            const ActiveIcon = btn.activeIcon
            const active = firstSection === btn.path
            return (
              <Button key={btn.path} {...this.props} path={btn.path} active={active}>
                {active
                  ? <ActiveIcon size={35} fill={COLORS.LIGHT_GREEN}/>
                  : <Icon size={35} fill={COLORS.GRAY}/>}
              </Button>
            )}
          )}
        </View>
    )
  }
}

Button.propTypes = {
  active: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
}

FooterMenu.propTypes = {
  location: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  footer: {
    flexBasis: 55,
    backgroundColor: COLORS.DARKEST_GRAY,
    flexDirection: 'row'
  },
  activeButton: {
    backgroundColor: '#000',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // added to fix iOS 12 onPress/svg issue, see https://github.com/react-native-community/react-native-svg/issues/794 
    overflow: 'hidden',
  }
})

export default withRouter(FooterMenu)
