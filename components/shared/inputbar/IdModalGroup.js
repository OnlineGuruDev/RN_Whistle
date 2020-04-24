import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text, Image, View, ScrollView, StyleSheet } from 'react-native'
import {
  getAthleticFieldsGroup,
  getPersonalFieldsGroup,
  getScheduleFieldsGroup,
  getOtherFieldsGroup,
  getWIDPicFieldsGroup,
} from '../../../selectors/contactFieldsSelectors'
import IdTagButton from './IdTagButton'
import Touchable from '../Touchable'
import Modal from '../Modal'
import ModalHeader from '../ModalHeader'
import { WID } from '../../../images/SVGImages'

class IdModalGroup extends React.Component {
  state = { idModalVisible: false }

  openIdModal = () => this.setState({ idModalVisible: true })

  closeIdModal = () => this.setState({ idModalVisible: false })

  addWIDTag = tag => {
    this.props.addWIDTag(`{{${tag}}}`)
    this.setState({ idModalVisible: false })
  }

  addWIDPic = tag => {
    this.props.addWIDPic(`[[${tag}]]`)
    this.setState({ idModalVisible: false })
  }

  render() {
    const { athleticFG, personalFG, scheduleFG, otherFG, wIDPicFG, messageTypeColor } = this.props
    return (
      <View style={styles.iconContainer}>
        <Touchable onPress={this.openIdModal}>
          <View style={styles.iconInnerContainer}>
            <WID fill={messageTypeColor} size={30}/>
          </View>
        </Touchable>
        <Modal
          visible={this.state.idModalVisible}
          animationType="slide"
          onRequestClose={this.closeIdModal}>
          <ModalHeader title="Whistle IDs" close={this.closeIdModal}/>
          <ScrollView contentContainerStyle={{ backgroundColor: '#fff' }}>
            <Text style={styles.tagsContainerLabel}>Athletic Tags</Text>
            <View style={styles.tagsContainer}>
              {athleticFG.map(tag =>
                <IdTagButton
                  key={tag.id}
                  tag={tag}
                  addWID={this.addWIDTag}/>)}
            </View>
            <Text style={styles.tagsContainerLabel}>Personal Tags</Text>
            <View style={styles.tagsContainer}>
              {personalFG.map(tag =>
                <IdTagButton
                  key={tag.id}
                  tag={tag}
                  addWID={this.addWIDTag}/>)}
            </View>
            <Text style={styles.tagsContainerLabel}>Schedule Tags</Text>
            <View style={styles.tagsContainer}>
              {scheduleFG.map(tag =>
                <IdTagButton
                  key={tag.id}
                  tag={tag}
                  addWID={this.addWIDTag}/>)}
            </View>
            <Text style={styles.tagsContainerLabel}>Other Tags</Text>
            <View style={styles.tagsContainer}>
              {otherFG.map(tag =>
                <IdTagButton
                  key={tag.id}
                  tag={tag}
                  addWID={this.addWIDTag}/>)}
            </View>
            <Text style={styles.tagsContainerLabel}>WID Pics</Text>
            <View style={styles.tagsContainer}>
              {wIDPicFG.map(tag =>
                <IdTagButton
                  key={tag.id}
                  tag={tag}
                  addWID={this.addWIDPic}/>)}
            </View>
          </ScrollView>
        </Modal>
      </View>
    )
  }
}

IdModalGroup.propTypes = {
  addWIDTag: PropTypes.func.isRequired,
  addWIDPic: PropTypes.func.isRequired,
  athleticFG: PropTypes.array.isRequired,
  otherFG: PropTypes.array.isRequired,
  personalFG: PropTypes.array.isRequired,
  scheduleFG: PropTypes.array.isRequired,
  wIDPicFG: PropTypes.array.isRequired,
  messageTypeColor: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
  iconContainer: {
    marginHorizontal: 5,
  },
  iconInnerContainer: {
    // added to fix iOS 12 onPress/svg issue, see https://github.com/react-native-community/react-native-svg/issues/794
    overflow: 'hidden',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 5,
  },
  tagsContainerLabel: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: '500',
    color: '#73bd32',
  },
})

const mapStateToProps = state => ({
  athleticFG: getAthleticFieldsGroup(state),
  personalFG: getPersonalFieldsGroup(state),
  scheduleFG: getScheduleFieldsGroup(state),
  otherFG: getOtherFieldsGroup(state),
  wIDPicFG: getWIDPicFieldsGroup(state),
})

export default connect(mapStateToProps)(IdModalGroup)
