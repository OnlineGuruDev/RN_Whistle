import React, { PureComponent } from 'react'
import { View, Image, StyleSheet } from "react-native"
//import { Video } from 'expo-av';
import Video from 'react-native-video'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import PropTypes from 'prop-types'
import Touchable from '../shared/Touchable'
import Modal from '../shared/Modal'
import { COLORS } from '../../reference/constants'
import VideoPlaceholder from '../../images/video-placeholder.jpg'

class ImageModal extends PureComponent {
  state = { modalVisible: false }

  openModal = () => this.setState({ modalVisible: true })

  closeModal = () => this.setState({ modalVisible: false })

  render() {
    return (
      <Touchable style={{alignItems: 'center'}} onPress={this.openModal}>
        <View style={{alignItems: 'center'}}>
          <Image style={styles.image} resizeMode="contain" source={VideoPlaceholder}/>
          <Modal animationType="fade" visible={this.state.modalVisible} transparent={true} onRequestClose={this.closeModal}>
            <View style={styles.modalBackground}>
              <Touchable style={styles.closeContainer} onPress={this.closeModal}>
                <Icon style={styles.close} size={40} name='md-close' />
              </Touchable>
              <Video
                {...this.props}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                useNativeControls
                style={styles.modalImage}
              />
            </View>
          </Modal>
        </View>
      </Touchable>
    )
  }
}

ImageModal.propTypes = {
  source: PropTypes.object.isRequired
}

const styles = StyleSheet.create( {
  image: {
    width: 200,
    height: 150,
    borderRadius: 3,
  },
  closeContainer: {
    display: 'flex',
    backgroundColor: 'black',
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  close: {
    padding: 10,
    color: COLORS.WHITE
  },
  modalBackground: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center'
  },
  modalImage: {
    flex: 1
  },
})

export default ImageModal
