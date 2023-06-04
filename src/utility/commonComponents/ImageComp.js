import React from 'react'

const ImageComp = ({ imageUrl, style, className = 'img-fluid mt-2' }) => {
  return <img src={imageUrl} alt="" className={className} style={style} />
}

export default ImageComp
