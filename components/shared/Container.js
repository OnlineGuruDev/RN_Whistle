import React from 'react'
import { View, StyleSheet } from 'react-native'

class Container extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default Container
