import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-native'
import { validateAuth, checkTokenComplete } from './actions/user'
import Loader from './components/shared/Loader'
import GraphicStorage from './components/GraphicStorage'
import PlayerProfiles from './components/PlayerProfiles'
import UnauthRoutes from './components/UnauthRoutes'

import AsyncStorage from '@react-native-community/async-storage';


class WhistleStorage extends React.Component {
  state = {
    sFModalOpen: true,
  }
  async componentDidMount() {
    try {
      let token = await AsyncStorage.getItem('access-token')//, config)//await SecureStore.getItemAsync('access-token')
      if (token !== null && token !== undefined) {
        await this.props.validateAuth()
        this.props.checkTokenComplete()
      } else {
        this.props.checkTokenComplete()
      }
    } catch (error) {
    }
  }

  trafficController = (type) => {
    if (this.props.user.isLoggedIn) {
      switch (type) {
        case 1:
          return <GraphicStorage handleSFPress={this.props.handleSFPress} setViewIndex={this.props.setViewIndex} />
        case 2:
          return <PlayerProfiles handleSFPress={this.props.handleSFPress} setViewIndex={this.props.setViewIndex} />
        default:
          return <PlayerProfiles handleSFPress={this.props.handleSFPress} setViewIndex={this.props.setViewIndex} />
      }
    } else {
      return <UnauthRoutes />
    }
  }

  render() {
    if (!this.props.user.tokenChecked || this.props.user.isFetchingAuth) { return <Loader /> }
    if (!this.props.user.tokenChecked) { return <Loader /> }
    return this.trafficController(this.props.type)
  }
}


WhistleStorage.propTypes = {
  user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user
})

export default withRouter(connect(mapStateToProps, {
  validateAuth,
  checkTokenComplete
})(WhistleStorage))
