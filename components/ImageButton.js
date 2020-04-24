//'use strict';
import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';

import {Text, Image} from 'react-native';

export default class ImageButton extends Component {
  constructor(props) {
    super(props);
    this.onPressButton = this.onPressButton.bind(this);
  }
  // Actions
  onPressButton() {
    if (this.props.onPress) {
      this.props.onPress();
    }
  }
  // Render
  render() {
    return (
      <TouchableOpacity style={this.props.style} onPress={this.onPressButton}>
        <Image source={this.props.img} style={this.props.imgstyle} />
      </TouchableOpacity>
    );
  }
}
