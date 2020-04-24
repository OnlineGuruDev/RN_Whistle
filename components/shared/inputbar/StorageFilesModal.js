import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { BASE_URL } from '../../../reference/constants'
import { View, StyleSheet, Text, Image, FlatList, Dimensions } from 'react-native'
//import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'; 

import { setErrorFlash } from '../../../actions/flash'

import Modal from '../Modal'
import ModalHeader from '../ModalHeader'
import Touchable from '../Touchable'
import Loader from '../Loader'

import includes from 'ramda/src/includes'

const StorageFilesModal = ({
  handleSFPress,
  visible,
  close,
  setErrorFlash,
}) => {
  const [storageFiles, setStorageFiles] = useState([])
  const [page, setPage] = useState(0)
  const [canLoadMore, setCanLoadMore] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const getStorageFiles = async () => {
    try {
      setIsLoaded(false)
      const { data } = await axios.get(`${BASE_URL}/api/v2/storage_files/get_files_paginated`, { params: { page: 1 } })
      setStorageFiles(sFs => data.storage_files)
      setPage(data.page)
      setCanLoadMore(data.can_load_more)
    } catch (e) {
      setErrorFlash(e)
    } finally {
      setIsLoaded(true)
    }
  }

  const getMoreStorageFiles = async () => {
    if (!canLoadMore || loadingMore) return
    setLoadingMore(true)
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v2/storage_files/get_files_paginated`, { params: { page: page + 1 } })
      setStorageFiles(sFs => [...sFs, ...data.storage_files])
      setPage(data.page)
      setCanLoadMore(data.can_load_more)
    } catch (e) {
      setErrorFlash(e)
    } finally {
      setLoadingMore(false)
    }
  }

  const clearStorageFiles = () => setStorageFiles([])

  const getStorageFileThumb = (file) => {
    if (includes('image', file.content_type)) {
      return (
        <Touchable style={styles.sFImageThumbContainer} onPress={() => handleSFPress(file)}>
          <Image style={styles.sFImageThumb} resizeMode="cover" source={{ uri: file.storage_file_url }}/>
          <Text numberOfLines={1} ellipsizeMode="middle" style={styles.sFLabel}>{file.label || file.file_name}</Text>
        </Touchable>
      )
    }
    if (includes('video', file.content_type)) {
      return (
        <Touchable style={styles.sFImageThumbContainer} onPress={() => handleSFPress(file)}>
          <View style={styles.sFIconThumb}>
            <Icon name="film" color="#fff" size={48}/>
          </View>
          <Text numberOfLines={1} ellipsizeMode="middle" style={styles.sFLabel}>{file.label || file.file_name}</Text>
        </Touchable>
      )
    }
    return (
      <Touchable style={styles.sFImageThumbContainer} onPress={() => handleSFPress(file)}>
        <View style={styles.sFIconThumb}>
          <Icon name="file" color="#fff" size={48}/>
        </View>
        <Text numberOfLines={1} ellipsizeMode="middle" style={styles.sFLabel}>{file.label || file.file_name}</Text>
      </Touchable>
    )
  }

  const renderStorageFile = ({ item }) => getStorageFileThumb(item)

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onShow={getStorageFiles}
      onDismiss={clearStorageFiles}
      onRequestClose={close}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ModalHeader title="Storage Files" close={close}/>
        {isLoaded
          ? (
            <FlatList
              keyExtractor={item => item.id.toString()}
              data={storageFiles}
              renderItem={renderStorageFile}
              onEndReached={getMoreStorageFiles}
              onEndReachedThreshold={0.1}
              contentContainerStyle={styles.storageFilesContainer}
              numColumns={2}
            />
          )
          : <Loader/>
        }
      </View>
    </Modal>
  )
}

const getThumbSize = parseInt(Dimensions.get('window').width / 2) - 40

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  storageFilesContainer: {
    alignItems: 'center',
    paddingBottom: 5,
  },
  sFImageThumbContainer: {
    margin: 20,
    position: 'relative',
  },
  sFImageThumb: {
    height: getThumbSize,
    width: getThumbSize,
    borderRadius: 10,
    overlayColor: '#333',
    overflow: 'hidden',
  },
  sFIconThumb: {
    position: 'relative',
    height: getThumbSize,
    width: getThumbSize,
    borderRadius: 10,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
  },
  sFLabel: {
    position: 'absolute',
    bottom: -10,
    textAlign: 'center',
    alignSelf: 'center',
    marginHorizontal: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    color: '#333',
    backgroundColor: '#f6f6f6',
    overflow: 'hidden',
  },
})

StorageFilesModal.propTypes = {
  handleSFPress: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  setErrorFlash: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default connect(null, {
  setErrorFlash,
})(StorageFilesModal)
