import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text } from 'react-native'

const TitleRender = ({recipients}) => {
  if (recipients.length) {
    const firstTitle = recipients[0].title
    const firstSplit = firstTitle.split(' ')
    // firstSplit here is the first recipient's [first_name, last_name, position]
    const firstGuy = firstSplit[0] + ' ' + firstSplit[1]

    if (recipients.length < 2) return <Text numberOfLines={1} style={styles.title}>{firstGuy}</Text>

    const secondTitle = recipients[1].title
    const secondSplit = secondTitle.split(' ')
    // secondSplit here is the second recipient's [first_name, last_name, position]
    const secondGuy = secondSplit[0] + ' ' + secondSplit[1]

    if (recipients.length === 2) {
      return <Text numberOfLines={1} style={styles.title}>{firstGuy} {secondGuy}</Text>
    } else {
      return <Text numberOfLines={1} style={styles.title}>{firstGuy} {secondGuy} + {recipients.length - 2}</Text>
    }
  } else {
    return null
  }
}

TitleRender.propTypes = {
  recipients: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16
  }
})

export default TitleRender
