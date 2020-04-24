import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Platform,
  View,
  Image,
  ScrollView,
  Text,
  KeyboardAvoidingView
} from 'react-native'

import { auth, loadOnBehalf } from '../actions/user'
import { setCoachCurrentStaff } from '../actions/currentStaff'
import { loadWIDFields } from '../actions/wIDFields'
import Logo from '../images/login.png'
//import { TEST_MANAGER, TEST_PASSWORD } from '../reference/variables'
import { COLORS } from '../reference/constants'
import validateInput from '../validation/loginValidations'
import { isValid } from '../reference/functions'

import PrimaryButton from './shared/PrimaryButton'
import PrimaryInput from './shared/PrimaryInput'
import Touchable from './shared/Touchable'

class Login extends React.Component {

  state = {
    email: '',//tonydungy@whistlerecruiting.com',//johngruden@whistlerecruiting.com',//luke@whistlerecruiting.com',//tonydungy
    // email: process.env.NODE_ENV === "development" ? TEST_MANAGER : '',
    password: '',//whistle17',//whistle17',//whistle17',
    // password: process.env.NODE_ENV === "development" ? TEST_PASSWORD : '',
    errors: {}
  }

  login = async () => {
    const { dispatch, user } = this.props
    const { email, password } = this.state
    const ok = await dispatch(auth(email, password))
    if (ok.ok) {
      dispatch(loadWIDFields())
      if (user.kind == "coach") {
        dispatch(setCoachCurrentStaff(user))
      }
    }
  }

  submit = () => {
    this.setState({ errors: {} })
    if (isValid(validateInput, this.state, (errors) => this.setState(errors)))
      this.login()
  }

  forgotPassword = () => this.props.history.push('/forgot-password', { email: this.state.email })

  render() {
    const { email, password, errors } = this.state
    const { user } = this.props
    return (
      <KeyboardAvoidingView
        style={styles.screenStyle}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
        </View>
        <View style={styles.logoView}>
          <Image source={Logo} style={styles.logo} />
        </View>
        <View style={styles.formContainer}>
          <PrimaryInput
            required
            label='Email'
            textContentType='username'
            keyboardType='email-address'
            onChangeText={v => this.setState({ email: v })}
            value={email}
            error={errors.email}
          />
          <PrimaryInput
            required
            secureTextEntry={true}
            label='Password'
            textContentType='password'
            onChangeText={v => this.setState({ password: v })}
            value={password}
            error={errors.password}
          />
          <View style={styles.submitContainer}>
            <PrimaryButton spinner={user.isFetchingAuth} action={this.submit} text='Login' />
            <Touchable onPress={this.forgotPassword}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </Touchable>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

const styles = {
  screenStyle: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 15
  },
  title: {
    color: '#555',
    fontSize: 24
  },
  formContainer: {
    margin: 15
  },
  submitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoView: {
    alignSelf: 'center',
    flex: 1,
    marginTop: 15
  },
  logo: {
    flex: 1,
    resizeMode: 'contain',
  },
  forgotPassword: {
    marginVertical: 5,
    color: COLORS.DARK_GRAY,
  },
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps)(Login)
