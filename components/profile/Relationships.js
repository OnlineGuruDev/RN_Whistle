import React from 'react'
import { ScrollView, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import { setErrorFlash } from '../../actions/flash'
import { BASE_URL } from '../../reference/constants'
import ContactItem from '../shared/ContactItem'
import Loader from '../shared/Loader'

class Relationships extends React.PureComponent {
  state = {
    loading: false,
    relationships: []
  }

  componentDidMount() {
    this.setState({ loading: true })
    axios.get(`${BASE_URL}/api/v2/contacts/${this.props.contact.id}/relationships`)
      .then(({ data: { relationships }}) => {
        this.setState({ relationships })
      })
      .catch(res => this.props.setErrorFlash(res))
      .finally(() => this.setState({ loading: false }))
  }

  render() {
    if (this.state.loading) return <Loader/>
    return (
      <ScrollView>
        {this.state.relationships.map(r => <ContactItem key={r.id} contact={r.influencer} relationship={r.label}/>)}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({

})

const mapStateToProps = state => ({
  contact: state.currentContact.data
})

export default connect(mapStateToProps, { setErrorFlash })(Relationships)
