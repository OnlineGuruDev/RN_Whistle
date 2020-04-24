import React from 'react'
import axios from 'axios'
import { BASE_URL, COLORS } from '../../reference/constants'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import prop from 'ramda/src/prop'
import sortBy from 'ramda/src/sortBy'
//import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import Icon from 'react-native-vector-icons/Ionicons'; 

import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'

import {
  getContactFieldsObject,
  getWIDFieldsNotPics,
} from '../../selectors/contactFieldsSelectors'
import { updateContact, loadContact } from '../../actions/contacts'
import { isValid } from '../../reference/functions'
import validateInput from '../../validation/profileEditValidations'

import Touchable from '../shared/Touchable'
import PrimaryInput from '../shared/PrimaryInput'
import SectionHeader from '../shared/SectionHeader'
import KeyboardView from '../shared/KeyboardView'
import Picker from '../shared/picker/Picker'
import Loader from '../shared/Loader'

const Header = ({ title, leftAction, rightAction, submitting }) =>
  <View style={styles.header}>
    <View style={styles.left}>
      <Touchable onPress={leftAction}>
        <View style={styles.iconContainer}>
          <MIcon name='cancel' color={COLORS.WHITE} size={28} />
        </View>
      </Touchable>
    </View>
    <View style={styles.center}>
      <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
    </View>
    <View style={styles.right}>
      <Touchable onPress={submitting ? () => {} : rightAction}>
        <View style={styles.iconContainer}>
          {submitting
            ? <ActivityIndicator color='white' animating size='small' />
            : <Icon name='md-checkmark' color={COLORS.WHITE} size={28} />}
        </View>
      </Touchable>
    </View>
  </View>

class ProfileEdit extends React.Component {
  state = {
    fields: this.props.fields,
    errors: {},
    positions: [],
    years: [],
    loaded: false,
  }

  componentDidMount() {
    this.loadContactProfile(this.props.match.params.contactId)
    axios.get(`${BASE_URL}/api/v2/teams/team_data`)
      .then(({ data }) => {
        this.setState({
          positions: sortBy(prop('label'), data.sport_positions),
          years: data.years.map(y => ({ label: y }))
        })
      })
  }

  loadContactProfile = contactId => {
    this.setState({ loaded: false })
    this.props.loadContact(contactId).then(res => {
      this.setState({ loaded: true })
    })
  }

  submit = () => {
    this.setState({ errors: {} })
    if (isValid(validateInput, this.state, (errors) => this.setState(errors))) {
      const { currentContact } = this.props
      let updatedContact = { ...currentContact, metadata: { fields: this.state.fields } }
      this.props.updateContact(currentContact.data.id, updatedContact)
        .then((resp) => {
          if (resp.ok)
            this.close()
        })
    }
  }

  close = () => this.props.history.goBack()

  renderItem = item => {
    if (item.label === 'Position') {
      return (
        <View key={item.id} style={styles.input}>
          <Picker
            key={item.id}
            label='Position'
            value={this.state.fields.position}
            onChange={v => this.setState(prevState => ({ fields: { ...prevState.fields, position: v } }))}
            options={this.state.positions}
          />
        </View>
      )
    } else if (item.label === 'Year') {
      return (
        <View key={item.id} style={styles.input}>
          <Picker
            label='Year'
            value={this.state.fields.year}
            onChange={v => this.setState(prevState => ({ fields: { ...prevState.fields, year: v } }))}
            options={this.state.years}
          />
        </View>
      )
    } else {
      return (
        <View key={item.id} style={styles.input}>
          <PrimaryInput
            label={item.label}
            onChangeText={v => this.setState(prevState => ({ fields: { ...prevState.fields, [item.field]: v } }))}
            value={this.state.fields[item.field]}
            error={this.state.errors[item.field]}
          />
        </View>
      )
    }
  }

  render() {
    if (!this.state.loaded) return <Loader/>
    const { widFieldsGroup, submitting, currentContact } = this.props
    const { first_name, last_name } = currentContact.data.metadata.fields
    const title = `${first_name} ${last_name}`
    return (
      <KeyboardView style={{ paddingBottom: 20, flex: 1 }}>
        <Header leftAction={this.close} rightAction={this.submit} title={title} submitting={submitting} />
        <ScrollView>
          <View style={styles.headerContainer}>
            <SectionHeader text='Athletic Information' />
          </View>
          {widFieldsGroup.map(item => this.renderItem(item))}
        </ScrollView>
      </KeyboardView>
    )
  }
}

Header.propTypes = {
  leftAction: PropTypes.func.isRequired,
  rightAction: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

ProfileEdit.propTypes = {
  currentContact: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  widFieldsGroup: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
}

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.DARKEST_GRAY,
    elevation: 3,
  },
  iconContainer: {
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  left: {
    flexBasis: 80,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  right: {
    flexBasis: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: 20,
  },
  headerContainer: {
    paddingBottom: 10,
  },
})

const mapStateToProps = state => ({
  widFieldsGroup: getWIDFieldsNotPics(state),
  fields: getContactFieldsObject(state),
  currentContact: state.currentContact,
  submitting: state.currentContact.submitting,
})

export default connect(mapStateToProps, { loadContact, updateContact })(ProfileEdit)
