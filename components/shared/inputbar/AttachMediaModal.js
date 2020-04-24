import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Alert } from 'react-native'
//import * as Permissions from 'expo-permissions'
//import * as ImagePicker from 'expo-image-picker'
import { request, PERMISSIONS } from 'react-native-permissions';

import ImagePicker from 'react-native-image-picker';
import { Photo } from '../../../images/SVGImages'

import Touchable from '../Touchable'
import { COLORS } from '../../../reference/constants'

const AttachMediaModal = ({
  addImage,
  hasMedia,
  messageTypeColor,
  openSFModal,
  removeMedia,
}) => {
  const setImage = result => !result.cancelled && addImage(result)

  const getPermission = async (permission) => {
    const p = await request(permission);
    return p === 'granted';
  }

  const openLibrary = async () => {
    const p = await getPermission(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (!p) {
      alert('You have disabled permissions to your photo library, you can change your phone Settings');
      return;
    }

    launchImageLibrary();
  }

  const openCamera = async () => {
    const p = await getPermission(PERMISSIONS.IOS.CAMERA);
    if (!p) {
      alert('You have disabled permissions to your camera, you can change your phone Settings');
      return;
    }
    launchCamera();
  }

  const handleCancel = () => {
    if (hasMedia) {
      Alert.alert(
        'Remove media?',
        null,
        [
          { text: 'Remove', onPress: () => removeMedia() },
          { text: 'No', onPress: () => { }, style: 'cancel' },
        ]
      )
    }
  }

  const openImageMenu = () => Alert.alert(
    'Attach Media',
    'Add media to this message...',
    [
      { text: 'Whistle Storage', onPress: () => openSFModal() },
      { text: 'Phone Storage', onPress: () => openLibrary() },
      { text: 'Camera', onPress: () => openCamera() },
      { text: 'Cancel', onPress: () => handleCancel(), style: 'cancel' },
    ]
  )

  const launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        setImage(response);
      }
    });

  }

  const launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        setImage(response)
      }
    });

  }

  return (
    <View style={styles.iconContainer}>
      <Touchable onPress={openImageMenu}>
        <View style={styles.iconInnerContainer}>
          <Photo fill={hasMedia ? COLORS.WARNING_ORANGE : messageTypeColor} size={30} />
        </View>
      </Touchable>
    </View>
  )
}

AttachMediaModal.propTypes = {
  addImage: PropTypes.func.isRequired,
  hasMedia: PropTypes.bool.isRequired,
  messageTypeColor: PropTypes.string.isRequired,
  openSFModal: PropTypes.func.isRequired,
  removeMedia: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  iconContainer: {
    marginHorizontal: 5,
  },
  iconInnerContainer: {
    // added to fix iOS 12 onPress/svg issue, see https://github.com/react-native-community/react-native-svg/issues/794
    overflow: 'hidden',
  },
})

export default AttachMediaModal
