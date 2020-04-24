import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import { View, StyleSheet, SectionList, Text, NativeModules, Dimensions } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { loadContacts } from './../actions/contacts'
import { UPDATE_CONTACT_QUERY } from './../actions/types'
import { addRecipient, removeRecipient } from './../actions/massMessages'
import { formattedContacts } from './../selectors/contactsSelectors'

import Touchable from './shared/Touchable'
import Loader from './shared/Loader'
import ListLoader from './shared/ListLoader'
import { ContactAvatar } from './shared/AvatarBubbles'
import ContactDisplay from './shared/ContactDisplay'
import SectionHeader from './shared/SectionHeader'
import SearchBar from './shared/SearchBar'
import KeyboardView from './shared/KeyboardView'
import { COLORS } from '../reference/constants'
const { RNMFMessageCompose} = NativeModules;
const deviceHeight = Dimensions.get('window').height
import PushList from './PushList'
class MessageList extends React.Component {
  state = {
    massRecipients: this.props.recipients,
    page: 1,
    showList: false
  }

  componentDidMount() {
    this.props.dispatch(loadContacts(1, this.props.query))
  }

  showPushList =  (id, included) => {
    this.setState({showList: true})
    // try {
    //   const res = await RNMFMessageCompose.send({
    //     recipients: [(id + '.com')],
    //     subject: 'This is text subject',
    //     body: 'This is body',
    //   });
    // } catch (e) {
    //   console.error('error', e);
    // }
  }
  hideList = () => {
    this.setState({showList: false})
  }
  renderItem = ({item}) => {
    const included = this.props.recipients.includes(item.id)
    return(
      <Touchable onPress={ () => this.showPushList(item.id, included)}>
        <View style={ included ? [styles.contactItem, {backgroundColor: '#f5f5f5'}] : styles.contactItem}>
          {/* <ContactAvatar contact={item} /> */}
          {/* <View style={styles.innerContactItem}> */}
            <ContactDisplay contact={item} />
            {/* <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 12}}> */}
              {/* <Icon style={included ? {color: '#ff8100'} : {color: '#ddd'}} size={40} name='ios-checkmark-circle-outline' /> */}
            {/* </View> */}
          {/* </View> */}
        </View>
      </Touchable>
    )
  }

  loadMore = () => {
    const { dispatch, query, canLoadMore, loadingMore } = this.props
    if (canLoadMore && !loadingMore)
      this.setState((prevState) => ({page: prevState.page + 1}), () => {
        dispatch(loadContacts(this.state.page, query))
      })
  }
  goBack = () => {
    this.props.hideList()
  }
  render() {
    const { contacts, query, isLoaded, loadingMore } = this.props
    const {showList} = this.state
    if (showList === true)
    return(
        <View style={{ height: deviceHeight}}>
          <PushList hideList = {this.hideList} />
        </View>
      )
    else
    return (
      <View style={styles.view}>
        <View style={styles.header}>
            <View style={styles.left}>
                <Touchable onPress={this.goBack}>
                <View style={styles.iconContainer}>
                    <Icon name='ios-arrow-back' color={COLORS.WHITE} size={28} />
                </View>
                </Touchable>
            </View>
            <View style={styles.center}>
                <Text allowFontScaling={false} numberOfLines={1} style={styles.headerTitle}>{'Recipient         '}</Text>
            </View>       
        </View>
        <KeyboardView offset={0} style={styles.view}>
          { !isLoaded
          ? <Loader />
          : <SectionList
              keyboardShouldPersistTaps='handled'
              ref={component => this._sectionList = component}
              renderItem={this.renderItem}
              // renderSectionHeader={headerItem => <SectionHeader text={headerItem.section.title} />}
              sections={contacts}
              stickySectionHeadersEnabled={true}
              keyExtractor={item => `${item.id}`}
              onEndReachedThreshold={0.1}
              onEndReached={this.loadMore}
            /> }
        </KeyboardView>
        { loadingMore && <ListLoader/> }
      </View>
    )
  }
}

MessageList.propTypes = {
  canLoadMore: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  contacts: PropTypes.array.isRequired,
  recipients: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  contactItem: {
    height: 60,
    paddingVertical: 5,
    paddingHorizontal: 3,
    flexDirection: 'row',
  },
  innerContactItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1
  },
  containerStyle: {
    backgroundColor: '#98c950',
  },
  titleFont: {
    fontSize: 18,
    color: '#555',
  },
  subtitleFont: {
    fontSize: 16,
    color: '#777'
  },
  header: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.DARKEST_GRAY,
    elevation: 3,
  },
  iconContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  left: {
    flexBasis: 70,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  right: {
    flexBasis: 70,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: 20,
  },
  subtitle: {
    color: COLORS.WHITE,
    fontSize: 14,
  },
})

const mapStateToProps = (state) => {
  return {
    canLoadMore: state.contacts.canLoadMore,
    isLoaded: state.contacts.isLoaded,
    loadingMore: state.contacts.loadingMore,
    query: state.contacts.contactSearchQuery,
    recipients: state.massMessages.recipients,
    contacts: formattedContacts(state),
  }
}

export default connect(mapStateToProps)(MessageList)
