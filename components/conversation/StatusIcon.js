import React from 'react'
//import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'; 

const StatusIcon = ({status}) => {
  const getIcon = () => {
    switch (status) {
      case "sent":
      case "delivered": return "check"
      case "failed":
      case "undelivered": return "exclamation-circle"
      default: return "ellipsis-h"
    }
  }
  const failed = getIcon() === "exclamation-circle" ? {color: "#d9534f"} : {}
  return <Icon style={[{color: 'rgba(255, 255, 255, 0.7)'}, failed]} name={getIcon()} size={16} />
}

export default StatusIcon
