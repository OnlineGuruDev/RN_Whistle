import React from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-native'

import {Alert, StyleSheet, View, TextInput} from 'react-native'
import KeyboardView from './shared/KeyboardView'
import IStorageFilesModal from './shared/inputbar/IStorageFilesModal'
import { COLORS } from '../reference/constants'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ThreeTabs from './shared/ThreeTabs'

class GraphicStorage extends React.Component {
  state = {  
    sFModalOpen: true,
    query: '',
  }
  handleSFPress = (file) => {
    this.props.handleSFPress(file)
    this.closeSFModal()
  }
  closeSFModal = () => this.setState({ sFModalOpen: false })
  openSFModal = () => this.setState({ sFModalOpen: true })  
  search = (text) => {
    this.setState({query: text})
  }
  goBack = () => {
    this.props.setViewIndex(0)
  }
  render() {
    const {query} = this.state
    const tab1Path = `/messenger/details/PICTURES`
    const tab2Path = `/messenger/details/VIDEOS`
    const tab3Path = `/messenger/details/GIFS`
    return(
      <View style={styles.view}>
        <View style={styles.searchSection}>
           <Ionicons
            style={styles.searchIcon}
            name="ios-search"
            size={20}
            color="#a8a9ac"
          />
          <TextInput
            style={styles.searchInput}
            placeholder={'Find images'}
            underlineColorAndroid="transparent"
            defaultValue={query}
            onChangeText={text => this.search(text)}
          />
        </View>
        <ThreeTabs
          tab1Path={tab1Path}
          tab2Path={tab2Path}
          tab3Path={tab3Path}
          tab1={'PICTURES'}
          tab2={'VIDEOS'}
          tab3={'GIFS'}
          backButton
          goBack = {this.goBack}
        />
        <Switch>
          <Route exact path="/messenger/details/" render={() => <Redirect to={tab1Path} />} />
          <Route path={tab1Path} render={() => <IStorageFilesModal handleSFPress={this.handleSFPress} filetype='image' fstr = {query} /> } />
          <Route path={tab2Path} render={() => <IStorageFilesModal handleSFPress={this.handleSFPress} filetype='video' fstr = {query} /> } />
          <Route path={tab3Path} render={() => <IStorageFilesModal handleSFPress={this.handleSFPress} filetype='gif' fstr = {query} /> } />
        </Switch>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  searchSection: {
    alignSelf: 'center',
    width: '96%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#efeff1',
  },
  searchInput: {
    flex: 1,
    padding: 8,
    paddingLeft: 0,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: '#efeff1',
  },
  searchIcon: {
    padding: 10,
  },
})
export default withRouter(GraphicStorage)

