import React from 'react'
import PropTypes from 'prop-types'
import { Alert, View, StyleSheet } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'

import { Schedule } from '../../../images/SVGImages'
import { COLORS } from '../../../reference/constants'
import Touchable from '../Touchable'

class ScheduleModal extends React.Component {

  state = { timeDatePickerVisible: false }

  openTimeDatePicker = () =>
    this.setState({ timeDatePickerVisible: true })

  handleCancel = () => {
    if (!this.props.isScheduled || !this.props.cancelSchedule) return this.closeDatePicker()
    Alert.alert(
      'Remove schedule time?',
      null,
      [
        { text: 'No', style: 'cancel', onPress: () => this.closeDatePicker() },
        { text: 'Remove',
          onPress: () => {
            this.props.cancelSchedule()
            this.closeDatePicker()
          },
        },
      ]
    )
  }

  closeDatePicker = () => {
    this.setState({ timeDatePickerVisible: false })
  }

  setSchedule = datetime => {
    this.props.setSchedule(datetime)
    this.closeDatePicker()
  }

  render() {
    const { timeDatePickerVisible } = this.state
    const { datetime, isScheduled, messageTypeColor } = this.props

    return (
      <View style={styles.iconContainer}>
        <Touchable onPress={this.openTimeDatePicker} >
          <View style={styles.iconInnerContainer}>
            <Schedule
              fill={isScheduled ? COLORS.WARNING_ORANGE : messageTypeColor}
              secondaryFill={COLORS.WHITE}
              size={30}
            />
          </View>
        </Touchable>
        <DateTimePicker
          date={datetime || new Date()}
          mode='datetime'
          is24Hour={false}
          minimumDate={new Date()}
          isVisible={timeDatePickerVisible}
          onConfirm={this.setSchedule}
          onCancel={this.handleCancel}
        />
      </View>
    )
  }
}

ScheduleModal.propTypes = {
  datetime: PropTypes.object.isRequired,
  isScheduled: PropTypes.bool.isRequired,
  setSchedule: PropTypes.func.isRequired,
  cancelSchedule: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
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
})

export default ScheduleModal
