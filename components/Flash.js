import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { Text, View, StyleSheet, Animated, SafeAreaView } from 'react-native'

import { COLORS } from '../reference/constants'

import Touchable from './shared/Touchable'

class Flash extends Component {
  state = {
    modalVisible: false,
    topAlign: new Animated.Value(0),
    flash: {},
    timers: [],
  }

  // componentWillReceiveProps(newProps) {//componentWillReceiveProps
  //   this.closeModal()
  //   if (this.props.flash != newProps.flash && newProps.flash.message) { // eslint-disable-line eqeqeq
  //     this.openModal(newProps.flash)
  //   }
  // }

  componentWillUnmount() {
    this.state.timers.forEach(t => clearTimeout(t))
  }

  flashAction = () => {
    this.state.flash.action && this.state.flash.action()
    this.closeModal()
  }

  openModal = (flash) => {
    this.setState({ modalVisible: true, flash: flash })
    this.state.timers.forEach(t => clearTimeout(t))
    this.showToast()
  }

  closeModal = () => {
    this.setState({ modalVisible: false, flash: {} })
    this.state.timers.forEach(t => clearTimeout(t))
  }

  showToast = () => {
    this.state.timers.push(setTimeout(() => {
      Animated.timing(this.state.topAlign, {
        toValue: 0,
        duration: 200,
      }).start()
      this.state.timers.push(setTimeout(() => { this.closeToast() }, this.state.flash.duration))
    }, 500))
  }

  closeToast = () => {
    Animated.timing(this.state.topAlign, {
      toValue: -50,
      duration: 200,
    }).start()
    this.state.timers.push(setTimeout(() => { this.setState({ modalVisible: false }) }, 500))
  }

  getToastStyle = () => ({
    position: 'absolute',
    elevation: 9,
    zIndex: 1000,
    flex: 1,
    flexDirection: 'row',
    // paddingHorizontal: Platform.OS === "ios" ? 20 : 0,
    top: this.state.topAlign,
    // borderRadius: 10,
  })

  render() {
    const { flash, modalVisible } = this.state
    if (!modalVisible) return null
    return (
      <Animated.View style={this.getToastStyle()}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.bigText}>
              <Text style={styles.text} numberOfLines={1} >{flash.message}</Text>
            </View>
            {flash.action
              ? (
                <Touchable onPress={this.flashAction}>
                  <View style={styles.buttonContainer}>
                    <Icon name='ios-checkmark-circle-outline' style={styles.acceptIcon} size={33} />
                  </View>
                </Touchable>
              )
              : null}
            <Touchable onPress={this.closeModal}>
              <View style={styles.buttonContainer}>
                <Icon name='ios-close-circle' style={styles.cancelIcon} size={33} />
              </View>
            </Touchable>
          </View>
        </SafeAreaView>
      </Animated.View>
    )
  }
}

Flash.propTypes = {
  flash: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    padding: 7,
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.OFF_WHITE,
    // borderRadius: 10,
  },
  text: {
    color: COLORS.FLASH_BACKGROUND,
  },
  bigText: {
    flex: 1,
  },
  buttonContainer: {
    width: 50,
    paddingHorizontal: 5,
  },
  acceptIcon: {
    color: COLORS.BTN_GREEN,
    alignSelf: 'center',
  },
  cancelIcon: {
    color: COLORS.ALERT_RED,
    alignSelf: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#333',
    // borderRadius: 10,
  },
})

const mapStateToProps = (state) => ({ flash: state.flash })

export default connect(mapStateToProps)(Flash)
