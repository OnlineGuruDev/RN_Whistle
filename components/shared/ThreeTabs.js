import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-native'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../reference/constants'
import Touchable from './Touchable'
import Ionicons from 'react-native-vector-icons/Ionicons';

const ThreeTabs = ({tab1Path, tab2Path, tab3Path, tab1, tab2, tab3, history, backButton, goBack}) => {
  let tab1Focus = history.location.pathname === tab1Path
  const tab2Focus = history.location.pathname === tab2Path
  const tab3Focus = history.location.pathname === tab3Path
  if(tab1Focus === false && tab2Focus === false && tab3Focus === false && (history.location.pathname === '/' || history.location.pathname === '/login')) {
    history.push(tab1Path)
    tab1Focus = true
  } 
  return (
    <View style={styles.container}>
      {backButton?
        <Touchable onPress={goBack}>
          <Ionicons
            style={styles.backIcon}
            name="ios-arrow-back"
            size={20}
            color="#a8a9ac"
          />
        </Touchable>
         : null
      }
      <Touchable style={styles.view} onPress={() => history.replace(tab1Path)}>
        <View style={[ styles.tab, tab1Focus && styles.activeTab ]}>
          <Text allowFontScaling={false} style={[ styles.font, tab1Focus && styles.activeFont ]}>{tab1}</Text>
        </View>
      </Touchable>
      <Touchable style={styles.view} onPress={() => history.replace(tab2Path)}>
        <View style={[ styles.tab, tab2Focus && styles.activeTab ]}>
          <Text allowFontScaling={false} style={[ styles.font, tab2Focus && styles.activeFont ]}>{tab2}</Text>
        </View>
      </Touchable>
      <Touchable style={styles.view} onPress={() => history.replace(tab3Path)}>
        <View style={[ styles.tab, tab3Focus && styles.activeTab ]}>
          <Text allowFontScaling={false} style={[ styles.font, tab3Focus && styles.activeFont ]}>{tab3}</Text>
        </View>
      </Touchable>
    </View>
  )
}

ThreeTabs.propTypes = {
  history: PropTypes.object.isRequired,
  tab1: PropTypes.string.isRequired,
  tab1Path: PropTypes.string.isRequired,
  tab2: PropTypes.string.isRequired,
  tab2Path: PropTypes.string.isRequired,
  tab3: PropTypes.string.isRequired,
  tab3Path: PropTypes.string.isRequired,
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
  },
  backIcon: {
    paddingLeft: 15,
    paddingRight: 30,
  },
})

export default withRouter(ThreeTabs)
