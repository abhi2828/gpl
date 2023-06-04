// ** React Imports
import { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Col,
  Form,
  Input,
  Label,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  Row
} from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'

import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'

import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'
// import { baseUrl } from '../../../../../app.config'
// import { Document, Page } from 'react-pdf'
import { Spinner } from 'react-bootstrap'
import PdfView from '../../../components/PdfView/PdfView'

const FileView = ({
  isOpen,
  userId,
  handleModalClosed,
  setShow,
  fileShow,
  setFileShow,
  getFileName
}) => {
  // ** States

  // const [numPages, setNumPages] = useState(null)

  // const onDocumentLoadSuccess = ({ numPages }) => {
  //   setNumPages(numPages)
  // }

  // const renderPages = () => {
  //   return Array.from({ length: numPages }, (_, i) => (
  //     <Page key={i + 1} pageNumber={i + 1} />
  //   ))
  // }

  // let fileName = getFileName.slice(getFileName.lastIndexOf("_")+1)

  const dispatch = useDispatch()

  const {
    reset,
    control,
    formState: { errors }
  } = useForm()

  return (
    <>
      <Modal
        isOpen={fileShow}
        toggle={() => setFileShow()}
        className="modal-dialog-centered modal-xl w-75 mx-auto"
      >
        <ModalHeader className=" pdfHeader" toggle={() => setFileShow()}>
          <h1> View File</h1>
        </ModalHeader>
        <ModalBody style={{ overflowY: 'clip' }}>
          <PdfView getFileName={getFileName} />
        </ModalBody>
      </Modal>
    </>
  )
}

export default FileView
