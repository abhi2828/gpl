import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Modal } from 'react-bootstrap'
import { Download } from 'react-feather'
import axios from 'axios'
import { baseUrl } from './../../../../../../app.config'
import toast from 'react-hot-toast'

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const PDFViewerModal = ({ urlData, show, handleClose }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }
  if (!urlData) {
    return <div>PDF URL is missing or empty</div>
  }

  const downloadPdf = (pdfData) => {
    const path = pdfData.slice(pdfData.lastIndexOf('/') + 1)
    axios
      .get(pdfData, { responseType: 'blob' })
      .then((res) => {
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', path)
        document.body.appendChild(link)
        link.click()
      })
      .catch((err) => toast.error('Something Went wrong '))
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <div className="d-flex align-items-center justify-content-between w-100">
          <Modal.Title>Certificate</Modal.Title>
          <div
            className=" py-0 px-2 pointer"
            onClick={() => downloadPdf(urlData)}
          >
            <Download size={20} color="#111" strokeWidth="3" />{' '}
            <span>Download PDF</span>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Document file={urlData} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PDFViewerModal
