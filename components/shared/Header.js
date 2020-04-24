import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
import { connect } from 'react-redux'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { withRouter } from 'react-router-native'
import Touchable from './Touchable'
import { COLORS } from '../../reference/constants'

const PickRight = ({rightIcon, rightAction, rightIconComponent}) => {
  if (rightIconComponent && rightAction) {
    return (
      <Touchable onPress={rightAction}>
        <View style={styles.iconContainer}>
          {rightIconComponent}
        </View>
      </Touchable>
    )
  }
  if (rightIcon && rightAction) {
    return (
      <Touchable onPress={rightAction}>
        <View style={styles.iconContainer}>
          <Icon name={rightIcon} color={COLORS.WHITE} size={28} />
        </View>
      </Touchable>
    )
  } else {
    return (<View />)
  }
}

const PickLeft = ({ backButton, openDrawer, goBack, manager, leftAction }) => {
  if (backButton) {
    return (
      <Touchable onPress={leftAction || goBack}>
        <View style={styles.iconContainer}>
          <Icon name='ios-arrow-back' color={COLORS.WHITE} size={28} />
        </View>
      </Touchable>
    )
  } else if (openDrawer && manager) {
    return (
      <Touchable onPress={openDrawer}>
        <View style={styles.iconContainer}>
          <Icon name='ios-menu' color={COLORS.WHITE} size={28} />
        </View>
      </Touchable>
    )
  } else {
    return (<View />)
  }
}

const Header = (props) => {
  const goBack = () => props.history.goBack()
  const manager = props.user.kind === 'manager'
  const addSubtitle = () => (manager && props.currentStaff.name && !props.nosubtitle)
    ? <Text numberOfLines={1}>
      { manager ? <Text allowFontScaling={false} style={styles.subtitle}>{props.currentStaff.name}</Text> : null }
    </Text>
    : null
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <PickLeft manager={manager} goBack={goBack} {...props} />
      </View>
      <View style={styles.center}>
        <Text allowFontScaling={false} numberOfLines={1} style={styles.headerTitle}>{props.title}</Text>
        { addSubtitle() }
      </View>
      <View style={styles.right}>
        <PickRight {...props} />
      </View>
    </View>
  )
}

Header.propTypes = {
  currentStaff: PropTypes.object.isRequired,
  backButton: PropTypes.bool,
  history: PropTypes.object.isRequired,
  openDrawer: PropTypes.func,
  rightAction: PropTypes.func,
  rightIcon: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.DARKEST_GRAY,
    elevation: 3
  },
  iconContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  center: {
    flex: 1,
    alignItems: 'center'
  },
  left: {
    flexBasis: 70,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  right: {
    flexBasis: 70,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: 20
  },
  subtitleContainer: {
    flexDirection: 'row'
  },
  subtitle: {
    color: COLORS.WHITE,
    fontSize: 14
  }
})

const mapStateToProps = state => ({
  currentStaff: state.currentStaff,
  user: state.user
})

export default withRouter(connect(mapStateToProps)(Header))
