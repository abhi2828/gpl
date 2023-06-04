import React from 'react'
import '../../sass/talent-philosophy/chros-desk.scss'

const Detail = ({ name, description }) => {
  console.log(description)
  return (
    <div className="chrosDesk_sec-div2-detail" key={name}>
      <h5 style={{ fontSize: '13px' }}>{name}</h5>
      <div className="chrosDesk_sec-div2-detail-des">
        {!description ? (
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          description
        )}
      </div>
    </div>
  )
}

export default Detail
