import React from 'react'
import { useDispatch } from 'react-redux'
import { Alert, Col, Button, Modal, ModalBody, ModalFooter } from 'reactstrap'

const DeleteModal = ({
  closeDeleteModal,
  showDeleteModal,
  payload,
  deletefunc,
  message = "You won't be able to revert this!"
}) => {
  const dispatch = useDispatch()
  const deleteDatas = async () => {
    await dispatch(deletefunc(payload))
    closeDeleteModal()
  }
  return (
    <div>
      <Modal
        isOpen={showDeleteModal}
        onClosed={closeDeleteModal}
        className="modal-dialog-centered"
      >
        <ModalBody className="text-center mt-1">
          <Col xs={20} className="text-center ">
            <div className="text-center mb-2">
              <h4 className="mb-1">
                <b>Are you sure?</b>
              </h4>
            </div>
            <Alert color="warning">
              <h6 className="alert-heading">Warning!</h6>
              <div className="alert-body">{message}</div>
            </Alert>
          </Col>
        </ModalBody>

        <ModalFooter>
          <Col xs={12} className="text-center mb-2">
            <Button
              className="me-1"
              color="primary"
              onClick={() => deleteDatas()}
            >
              Yes
            </Button>
            <Button outline type="reset" onClick={closeDeleteModal}>
              Discard
            </Button>
          </Col>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default DeleteModal
