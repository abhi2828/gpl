import React, { useState, useEffect, lazy } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CommonHeader } from '../../../components/common-header/CommonHeader'
// import PDFViewer from '../../../components/pfd-view/PDFViewer'
import '../../../sass/talent-philosophy/talent-philosophy.scss'
// import { downloaFile } from '../my-career-aspiration/store'
// import { Document, Page } from 'react-pdf'
import { PDFDocument } from 'pdf-lib'
import Spinner from '@components/spinner/Loading-spinner'
import FileView from '../../../../masters/talent-philosophy/FileView'
import PdfView from '../../../../../components/PdfView/PdfView'
import { Col, Row } from 'react-bootstrap'
import { Download } from 'react-feather'

const HumanResource = () => {
  const [compressedPdf, setCompressedPdf] = useState(null)
  const location = useLocation()
  let navigate = useNavigate()
  const { file, name } = JSON.parse(window.localStorage.getItem('career-track'))
  const newFile = file.split('downloadFile/')
  const File = newFile[1].replace(/%20/g, '-')
  const url = 'https://www.orimi.com/pdf-test.pdf'
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    async function fetchAndCompressPdf() {
      const pdfBytes = await fetch(file).then((res) => res.arrayBuffer())
      const pdfDoc = await PDFDocument.load(pdfBytes)

      const compressedPdfBytes = await pdfDoc.save()
      setCompressedPdf(compressedPdfBytes)
    }

    fetchAndCompressPdf()
  }, [])

  let fileName = file.slice(file.lastIndexOf('_') + 1).replace('.pdf', '')

  return (
    <div className="humanResource">
      <div className="bg_for_career_pdf">
        <CommonHeader
          name={name}
          path={'/user-talent-philosophy'}
          download={file}
          fileName={fileName}
        />
        <h2>
          <strong>{fileName?.split('%20')?.join(' ')}</strong>
        </h2>
      </div>
      <div className="pdf_wrapper">
        <PdfView getFileName={file} />
      </div>
    </div>
  )
}

export default HumanResource
