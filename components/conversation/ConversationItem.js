import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import VoiceMessage from './VoiceMessage'
import TextMessage from './TextMessage'
import AppleiMessage from './AppleiMessage'
import TwitterDM from './TwitterDM'

class ConversationItem extends PureComponent {
  render() {
    const { item, contact } = this.props
    switch (item.kind) {
      case 'voice':
        return <VoiceMessage inbound={item.direction === 'inbound'} item={item} contact={contact} />
      case 'message':
        return <TextMessage inbound={item.direction === 'inbound'} item={item} contact={contact} />
      case 'twitter_dm':
        return <TwitterDM inbound={item.direction === 'inbound'} item={item} contact={contact} />
      case 'imessage':
        return <AppleiMessage inbound={item.direction === 'inbound'} item={item} contact={contact} />
      default:
        return <Text>Unrecognized Message</Text>
    }
  }
}

ConversationItem.propTypes = {
  item: PropTypes.object.isRequired
}

export default ConversationItem
