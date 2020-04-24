import React from 'react'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'
import ReviewItem from './ReviewItem'
import Loader from '../shared/Loader'

const SentMessages = ({
  messages,
  isLoaded,
  getMessages,
  refreshing,
  resendMessage,
  resendiMessage,
}) => {
  if (!isLoaded) return <Loader />
  return (
    <FlatList
      keyboardShouldPersistTaps='handled'
      data={messages}
      onRefresh={getMessages}
      refreshing={refreshing}
      keyExtractor={item => `${item.id}`}
      renderItem={({ item }) => <ReviewItem pI={item} resendMessage={resendMessage} resendiMessage={resendiMessage}/>}
    />
  )
}

SentMessages.propTypes = {
  messages: PropTypes.array.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  getMessages: PropTypes.func.isRequired,
  resendMessage: PropTypes.func.isRequired,
}

export default SentMessages
