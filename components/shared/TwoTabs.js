import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-native'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../reference/constants'
import Touchable from './Touchable'

const TwoTabs = ({tab1Path, tab2Path, tab1, tab2, history}) => {
  const tab1Focus = history.location.pathname === tab1Path
  return (
    <View style={styles.container}>
      <Touchable style={styles.view} onPress={() => history.replace(tab1Path)}>
        <View style={[ styles.tab, tab1Focus && styles.activeTab ]}>
          <Text allowFontScaling={false} style={[ styles.font, tab1Focus && styles.activeFont ]}>{tab1}</Text>
        </View>
      </Touchable>
      <Touchable style={styles.view} onPress={() => history.replace(tab2Path)}>
        <View style={[ styles.tab, !tab1Focus && styles.activeTab ]}>
          <Text allowFontScaling={false} style={[ styles.font, !tab1Focus && styles.activeFont ]}>{tab2}</Text>
        </View>
      </Touchable>
    </View>
  )
}

TwoTabs.propTypes = {
  history: PropTypes.object.isRequired,
  tab1: PropTypes.string.isRequired,
  tab1Path: PropTypes.string.isRequired,
  tab2: PropTypes.string.isRequired,
  tab2Path: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderBottomColor: COLORS.LIGHT_GRAY,
    borderBottomWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50
  },
  font: {
    fontSize: 16,
    color: COLORS.LIGHT_GRAY
  },
  activeFont: {
    color: COLORS.BLACK
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderBottomColor: COLORS.WHITE,
    borderBottomWidth: 3
  },
  activeTab: {
    borderBottomColor: COLORS.LIGHTER_GREEN,
    borderBottomWidth: 3
  },
  icon: {
    color: COLORS.LIGHTER_GREEN
  }
})

export default withRouter(TwoTabs)
