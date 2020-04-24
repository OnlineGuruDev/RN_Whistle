import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { BASE_URL } from '../../reference/constants'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'
import prop from 'ramda/src/prop'
import sortBy from 'ramda/src/sortBy'
import { Text, View, StyleSheet, ScrollView } from 'react-native'

import { addContact } from '../../actions/contacts'
import validateInput from '../../validation/newContactFormValidations'
import { isValid } from '../../reference/functions'

import Picker from '../shared/picker/Picker'
import Touchable from '../shared/Touchable'
import PrimaryButton from '../shared/PrimaryButton'
import PrimaryInput from '../shared/PrimaryInput'
import KeyboardView from '../shared/KeyboardView'

const fields = [
  { id: "first_name", name: "First Name", optional: false },
  { id: "last_name", name: "Last Name", optional: false },
  { id: "phone_number", name: "Phone Number", optional: false },
  { id: "year", name: "Year", optional: false },
  { id: "position", name: "Position", optional: false }
]

class NewContact extends React.Component {
  state = {
    first_name: '',
    last_name: '',
    phone_number: '',
    year: '',
    position: '',
    submitting: false,
    errors: {},
    positions: [],
    years: [],
  }

  componentDidMount() {
    axios.get(`${BASE_URL}/api/v2/teams/team_data`)
      .then(({ data }) => {
        this.setState({
          positions: sortBy(prop('label'), data.sport_positions),
          years: data.years.map(y => ({label: y}))
        })
      })
  }

  _close = () => this.props.history.goBack()

  positionChange = value => this.setState({position: value})

  yearChange = value => this.setState({year: value})

  submitForm = () => {
    this.setState({ submitting: true, errors: {} })
    if (isValid(validateInput, this.state, (errors) => this.setState(errors))) {
      const { first_name, last_name, phone_number, year, position } = this.state
      this.props.dispatch(addContact({first_name, last_name, phone_number, year, position}))
      .then(res => {
        if (res.ok) {
          this._close()
        } else {
          this.setState({errors: res.errors, submitting: false})
        }
      })
    } else {
      this.setState({submitting: false})
    }
  }

  render () {
    const { first_name, last_name, phone_number, errors, submitting } = this.state
    return(
      <View style={styles.fields}>
        <KeyboardView style={{flex: 1, flexDirection: 'row'}}>
          <ScrollView keyboardShouldPersistTaps='handled'>
            <View style={styles.header}>
              <Text style={styles.title}>New Contact</Text>
            </View>
            <View style={styles.inputsContainer}>
              <PrimaryInput
                required
                label='First Name'
                onChangeText={v => this.setState({first_name: v})}
                autoCapitalize='words'
                autoFocus={true}
                value={first_name}
                error={errors.first_name}
              />
              <PrimaryInput
                required
                label='Last Name'
                onChangeText={v => this.setState({last_name: v})}
                autoCapitalize='words'
                value={last_name}
                error={errors.last_name}
              />
              <PrimaryInput
                required
                label='Phone Number'
                onChangeText={v => this.setState({phone_number: v})}
                keyboardType="phone-pad"
                value={phone_number}
                error={errors.phone_number || errors.twl_phone_number && errors.twl_phone_number.join(', ')}
              />
              <Picker
                required
                label='Year'
                value={this.state.year}
                onChange={this.yearChange}
                options={this.state.years}
                error={errors.year}
              />
              <Picker
                required
                label='Position'
                value={this.state.position}
                onChange={this.positionChange}
                options={this.state.positions}
                error={errors.position}
              />
            </View>
            <View>
              <PrimaryButton spinner={submitting} text='Submit' action={this.submitForm} />
              <PrimaryButton text='Close' action={this._close} />
            </View>
          </ScrollView>
        </KeyboardView>
      </View>
    )
  }
}

NewContact.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 15
  },
  title: {
    color: '#555',
    fontSize: 24
  },
  largeField: {
    height: 60,
    width: 300,
  },
  inputsContainer: {
    flex: 1,
    margin: 15
  },
  fields: {
    padding: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red'
  },
})

export default withRouter(connect()(NewContact))
