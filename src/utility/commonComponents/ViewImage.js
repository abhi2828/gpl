import React from 'react'
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner
} from 'reactstrap'
const ViewImage = ({ viewImage, url, handleModalClosed }) => {
  return (
    <Modal
      isOpen={viewImage}
      onClosed={handleModalClosed}
      toggle={handleModalClosed}
      className="modal-dialog-centered"
    >
      <ModalHeader
        className="bg-transparent "
        toggle={handleModalClosed}
      ></ModalHeader>
      <ModalBody>
        <img src={url} className="img-fluid my-2" />
      </ModalBody>
    </Modal>
  )
}

export default ViewImage
