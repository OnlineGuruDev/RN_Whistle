import React from 'react'
import PropTypes from 'prop-types'
import ImageModal from '../shared/ImageModal'
import VideoModal from '../shared/VideoModal'
import take from 'ramda/src/take'

const Media = ({ attachments = [] }) => {
  return take(1, attachments).map((a, i) => {
    const ext = a.match(/^[^?]*/)[0].split(".").pop().toLowerCase()
    if (ext === "mp4" || ext === "mov" || ext === "avi" || ext === "webm" || ext === "3gpp" || ext === "3gp") {
      return (
        <VideoModal key={i} source={{uri: a}}/>
      )
    } else {
      return (
        <ImageModal key={i} source={{uri: a}} />
      )
    }
  })
}

Media.propTypes = {
  attachments: PropTypes.array.isRequired
}

export default Media
