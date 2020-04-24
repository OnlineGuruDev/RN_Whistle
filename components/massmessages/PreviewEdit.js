import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, FlatList, Alert, Text, } from 'react-native'
import { COLORS } from '../../reference/constants'
//import { MaterialIcons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/MaterialIcons'; 

import { connect } from 'react-redux'
import { removeRecipientMMForm } from '../../actions/massMessages'
import { Preview } from '../../images/SVGImages'
import PreviewEditItem from './PreviewEditItem'
import Loader from '../shared/Loader'

const PreviewEdit = ({ isLoading, previewItems, removeRecipientMMForm, attachment, localAttachment, newMessageRoute }) => {
  if (isLoading) return <Loader />
  if (!previewItems.length) return (
    <View style={styles.placeHolderContainer}>
      <View style={styles.placeHolder}>
        <Text style={styles.placeHolderText}>Tap </Text>
        {newMessageRoute
        ? <Preview fill={COLORS.GRAY} secondaryFill={COLORS.WHITE} size={20} />
        : <Icon name='save' color={COLORS.GRAY} size={20} />}
        <Text style={styles.placeHolderText}> to see preview.</Text>
      </View>
    </View>
  )

  removeConfirm = id => {
    Alert.alert('Confirm', 'Remove Recipient?',
      [
        {text: 'Cancel'},
        {text: 'OK', onPress: () => removeRecipientMMForm(id)}
      ]
    )
  }

  return (
    <View style={styles.previewList}>
      {/*FlatList bug, won't rerender with just a string. passing arbitrary obj w/string as a value makes it work*/}
      <FlatList
        keyboardShouldPersistTaps='handled'
        data={previewItems}
        extraData={{what: attachment}}
        keyExtractor={item => `${item.to.id}`}
        renderItem={({item}) =>
          <PreviewEditItem
            key={item.to.id}
            pI={item}
            removeRecipient={removeConfirm}
            attachment={attachment}
            localAttachment={localAttachment}
          />
        }
      />
    </View>
  )
}

PreviewEdit.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  previewItems: PropTypes.array.isRequired,
  removeRecipientMMForm: PropTypes.func.isRequired,
  attachment: PropTypes.string,
}

const styles = StyleSheet.create({
  previewList: {
    flex: 1
  },
  placeHolderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeHolder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeHolderText: {
    fontSize: 20
  },
})

const mapStateToProps = state => ({
  isLoading: state.massMessages.isLoading,
  previewItems: state.massMessages.preview,
  attachment: state.massMessages.attachment,
  localAttachment: state.massMessages.localAttachment,
})

export default connect(mapStateToProps, {
  removeRecipientMMForm
})(PreviewEdit)
