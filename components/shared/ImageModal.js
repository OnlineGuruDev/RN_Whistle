import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Image, StyleSheet } from "react-native"
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import Touchable from '../shared/Touchable'
import { COLORS } from '../../reference/constants'
import Modal from '../shared/Modal'

class ImageModal extends PureComponent {
  state = { modalVisible: false }

  openModal = () => this.setState({ modalVisible: true })

  closeModal = () => this.setState({ modalVisible: false })

  render() {
    if (!this.props.source?.uri) return null
    return (
      <Touchable style={{ alignItems: 'center' }} onPress={this.openModal}>
        <View style={{ alignItems: 'center' }}>
          <Image style={styles.image} resizeMode="contain" {...this.props}/>
          <Modal animationType="fade" visible={this.state.modalVisible} transparent={true} onRequestClose={this.closeModal}>
            <View style={styles.modalBackground}>
              <Touchable style={styles.closeContainer} onPress={this.closeModal}>
                <Icon style={styles.close} size={40} name='md-close' />
              </Touchable>
              <View style={styles.modalBackground}>
                <Image {...this.props} style={styles.modalImage} resizeMode="contain"/>
              </View>
            </View>
          </Modal>
        </View>
      </Touchable>
    )
  }
}

ImageModal.propTypes = {
  source: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 150,
    borderRadius: 3,
  },
  modalBackground: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
  },
  modalImage: {
    flex: 1,
  },
  closeContainer: {
    display: 'flex',
    backgroundColor: 'black',
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  close: {
    padding: 10,
    color: COLORS.WHITE,
  },
})

export default ImageModal
