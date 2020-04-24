import React from 'react'
import { Modal as _Modal, SafeAreaView } from 'react-native'

// Iphone X Modal support
const Modal = props => {
  return (
    <_Modal
      supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
      {...props}
    >
      <SafeAreaView style={{flex: 1, backgroundColor: '#333'}}>
        {props.children}
      </SafeAreaView>
    </_Modal>
  )
}

export default Modal
