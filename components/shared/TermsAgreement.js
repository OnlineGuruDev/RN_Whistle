import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TermsModal from './TermsModal'

const TermsAgreement = ({
  user,
}) => {
  if (user.terms_agreement) return null
  return <TermsModal userId={user.id}/>
}

TermsAgreement.propTypes = {
  user: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  user: state.user,
})

export default connect(mapStateToProps)(TermsAgreement)
