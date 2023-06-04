import React from 'react'
import { Download } from 'react-feather'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button } from 'reactstrap'
import arrow_up_circle from '../../../../assets/images/customIcon/arrow_up_circle.svg'
import '../../sass/home/Testimonials.scss'

export const CommonHeader = ({ name, path, download, fileName }) => {
  let navigate = useNavigate()
  const routeChange = () => {
    navigate(path)
  }
  const downloadPdf = (pdfData, fileName) => {
    axios
      .get(pdfData, { responseType: 'blob' })
      .then((res) => {
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName?.split('%20')?.join(' '))
        document.body.appendChild(link)
        link.click()
      })
      .catch((err) => toast.error('Something Went wrong '))

    // const blob = new Blob([pdfData], { type: 'application/pdf' })
    // const url = URL.createObjectURL(blob)
    // const link = document.createElement('a')
    // link.href = url
    // link.download = fileName
    // link.click()
    // URL.revokeObjectURL(url)
  }
  return (
    <div className="myheader_wrapper">
      <div className="learning_middle_sec1 header_wraper d-flex align-items-center text-center home_common_header">
        <button className="bg_maroon_color" onClick={routeChange}>
          <img src={arrow_up_circle} alt="back" />
        </button>
        <h2>{name}</h2>
      </div>
      {download && (
        <div className="dowloadPdf pointer">
          <div onClick={() => downloadPdf(download, fileName)}>
            <Download size={20} color="#fff" strokeWidth="3" />{' '}
            <span>Download PDF</span>
          </div>
        </div>
      )}
    </div>
  )
}

export const CommonHeader_Gallary = ({ name, path, customClass }) => {
  let navigate = useNavigate()
  const routeChange = () => {
    navigate(path)
  }

  return (
    <div className={`${customClass} CommonHeader_Gallary text-center pt-1`}>
      <button
        className="bg_maroon_color maroon_color_btn p-0"
        onClick={routeChange}
      >
        <img src={arrow_up_circle} alt="back" />
      </button>
      <h2 className="CommonHeader_Gallary_title">{name}</h2>
    </div>
  )
}
