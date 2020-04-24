import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
import { connect } from 'react-redux'
//import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons'; 

import { withRouter } from 'react-router-native'
import Touchable from './Touchable'
import { COLORS } from '../../reference/constants'

const Header = ({
  history,
  user,
  currentStaff,
  title,
  menu,
}) => {
  const goBack = () => history.goBack()
  const manager = user.kind === 'manager'
  const addSubtitle = () => (manager && currentStaff.name)
    ? (
      <Text numberOfLines={1}>
        { manager ? <Text allowFontScaling={false} style={styles.subtitle}>{currentStaff.name}</Text> : null }
      </Text>
    )
    : null
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Touchable onPress={goBack}>
          <View style={styles.iconContainer}>
            <Icon name='ios-arrow-back' color={COLORS.WHITE} size={28} />
          </View>
        </Touchable>
      </View>
      <View style={styles.center}>
        <Text allowFontScaling={false} numberOfLines={1} style={styles.headerTitle}>{title}</Text>
        { addSubtitle() }
      </View>
      <View style={styles.right}>
        {menu}
      </View>
    </View>
  )
}

Header.propTypes = {
  currentStaff: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
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

const mapStateToProps = state => ({
  currentStaff: state.currentStaff,
  user: state.user,
})

export default withRouter(connect(mapStateToProps)(Header))
