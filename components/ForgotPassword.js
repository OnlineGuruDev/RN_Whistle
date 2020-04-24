import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import {
  View,
  Image,
  Alert,
  Text,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'

import Logo from '../images/login.png'
import { COLORS, BASE_URL } from '../reference/constants'
import validateInput from '../validation/passwordResetValidations'
import { isValid } from '../reference/functions'

import PrimaryButton from './shared/PrimaryButton'
import PrimaryInput from './shared/PrimaryInput'

class ForgotPassword extends React.Component {
  state = {
    email: this.props.location.state.email || '',
    errors: {},
    loading: false,
  }

  submit = () => {
    this.setState({ errors: {} })
    if (isValid(validateInput, this.state, (errors) => this.setState(errors))) this.resetPassword()
  }

  resetPassword = () => {
    this.setState({ loading: true })
    axios.post(`${BASE_URL}/api/staffs/forgot_password`, { email: this.state.email } )
      .then(res => {
        Alert.alert(`Email sent. Check ${this.state.email} for password reset instructions.`)
        this.props.history.push('/login')
      })
      .catch(err => {
        Alert.alert(`There was a problem sending the password reset email.`)
        this.setState({ loading: false })
        console.log(err)
      })
  }

  render() {
    const { email, errors } = this.state
    const { user } = this.props
    return (
      <KeyboardAvoidingView
        style={styles.screenStyle}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Password Reset</Text>
        </View>
        <View style={styles.logoView}>
          <Image source={Logo} style={styles.logo}/>
        </View>
        <View style={styles.instructions}>
          <Text style={styles.instructionsText}>Enter your account email address to receive password reset instructions.</Text>
        </View>
        <View style={styles.formContainer}>
          <PrimaryInput
            required
            label='Email'
            onChangeText={v => this.setState({email: v})}
            value={email}
            error={errors.email}
          />
          <View style={styles.submitContainer}>
            <PrimaryButton
              spinner={this.state.loading}
              action={this.submit}
              text='Submit'
            />
            <PrimaryButton
              action={() => this.props.history.push('/login')}
              text='Back'
              buttonStyle={styles.backButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

ForgotPassword.propTypes = {
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
    marginTop: 5,
    color: COLORS.DARK_GRAY,
  },
  instructions: {
    marginHorizontal: 15,
  },
  instructionsText: {
    fontSize: 16
  },
  backButton: {
    backgroundColor: COLORS.LIGHT_GRAY
  },
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps)(ForgotPassword)
