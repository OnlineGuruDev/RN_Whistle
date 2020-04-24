import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-native'
import { validateAuth, checkTokenComplete } from './actions/user'
import ShareExtension from 'react-native-share-extension'
import Login from './components/Login'
import { BASE_URL } from './reference/constants'

import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

class MyShareExStorage extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.state = {
        isOpen: true,
        type: '',
        value: '',
        label: '',
        token: false,
      }
    }
  

    async componentDidMount() {
      console.log('000')
      try {
        console.log('111')
        let token = await AsyncStorage.getItem('access-token')
        if (token !== null && token !== undefined) {
          this.setState({token: true})
        } else {
          this.setState({token: false})
        }
        const a = await ShareExtension.data()
        console.log('======>>>')
        console.log(a)
        const { type, value } = await ShareExtension.data()
        this.setState({
          type,
          value
        })
      } catch(e) {
        console.log('errrr', e)
      }
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.user.isLoggedIn) {
        this.setState({token: true})
      }
    }
  
    onClose = () => {
     ShareExtension.close()
    }
  
    closing = () => {
     this.setState({ isOpen: false });
     ShareExtension.close()
    }
    
    saving = async () => {
      console.log("------------->@@@")
      var myHeaders = new Headers();
      myHeaders.append("mobile", "true");
      myHeaders.append("uid", await AsyncStorage.getItem('uid'));
      myHeaders.append("client", await AsyncStorage.getItem('client'));
      myHeaders.append("access-token", await AsyncStorage.getItem('access-token'));
      myHeaders.append("token-type", await AsyncStorage.getItem('token-type'));
      myHeaders.append("expiry", await AsyncStorage.getItem('expiry'));
  
      const data = new FormData();
      data.append("storage_file[label]", this.state.label)
      data.append("storage_file[file]", {uri: this.state.value, name: this.state.label, type: 'image/jpeg'})
      console.log("------------->")
  console.log(`${BASE_URL}/api/v2/storage_files/create`)
      console.log(encodeURI(this.state.value))


      fetch(`${BASE_URL}/api/v2/storage_files/create`, {
        method: 'POST',
        headers: myHeaders,
        body: data
      }) 
      .then(() => {
        console.log('Success')
        ShareExtension.close()
      }).catch(e=>{
        console.info(e)
      })
    }
  
    render() {
      if (!this.state.token) return <Login /> 
      return (
         <Modal
           animationType="slide"
             transparent={true}
             visible={this.state.isOpen}
             style = {{width: 300, height: 400, backgroundColor: 'red'}}
             onRequestClose={() => {
               Alert.alert('Modal has been closed.');
             }}>
           <View style={{ alignItems: 'center', justifyContent:'center', backgroundColor: 'transparent', flex: 1 }}>
             <View style={styles.mainView}>
               <View style = {styles.headerView}>
                 <TouchableOpacity onPress = {this.closing}>
                   <Text style = {styles.cancelBtn}>Cancel</Text>
                 </TouchableOpacity>
                 <Text style = {styles.titleTxt}>Whistle</Text>
                 <Text style = {{color: 'transparent'}}>Cancel</Text>
               </View>
               <View style = {styles.urlView}>
                 <Text>{ this.state.value }</Text>
                 <TextInput
                   style={{height: 40, marginTop: 10}}
                   onChangeText={text => this.setState({label: text})}
                   placeholder="Please input image name"
                 />
               </View>
               
               <View style = {{padding: 15, alignItems: 'center'}}>
                 <TouchableOpacity onPress={this.saving}>
                   <Text style = {styles.cancelBtn}>Save</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </View>
         </Modal>
      );
    }
  }
  
  const styles = StyleSheet.create({
   safeArea: {
     flex: 1,
     backgroundColor: '#333',
   },
   withinSafeArea: {
     flex: 1,
   },
   mainView: {
     borderRadius: 10,
     backgroundColor: 'white', 
     width: 300,
     
   },
   headerView: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     borderBottomWidth: 1,
     borderColor: 'lightgray',
     padding: 15
   },
   titleTxt: {
     fontSize: 16,
   },  
   buttonView: {
     flexDirection: 'row',
     flex: 1,
     alignItems: 'center',
     justifyContent: 'flex-end',
     backgroundColor: 'yellow',
   },
   cancelBtn: {
     color: 'blue',
     fontSize: 15
   },
   urlView :{
     padding: 15,
     borderBottomWidth: 1,
     borderColor: 'lightgray'
   }
 })

MyShareExStorage.propTypes = {
  user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user
})

export default withRouter(connect(mapStateToProps, {
  validateAuth,
  checkTokenComplete
})(MyShareExStorage))

