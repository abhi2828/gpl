import React from 'react'
import { useDispatch } from 'react-redux'
import { Alert, Col, Button, Modal, ModalBody, ModalFooter } from 'reactstrap'

const ShowDetailsModal = ({
  closeDetails,
  showDetailsModal,
  userDetailsModal,
  userType
}) => {
  const dispatch = useDispatch()
  const deleteDatas = () => {
    closeDetails()
  }
  return (
    <div>
      <Modal
        isOpen={showDetailsModal}
        onClosed={closeDetails}
        className="modal-dialog-centered"
      >
        <div className="header_style roledetails row">
          <div className="maroon_color col-4"></div>
          <div className="primary_color col-4"></div>
          <div className="success_color col-4"></div>
        </div>
        <ModalBody className="text-center mt-1">
          <Col xs={12} className="text-center">
            <div className="title_wrapper">
              {userType === 'sponsor' ? (
                <>
                  <p className="title my-2">Sponsor Profile</p>
                  <img
                    variant="top"
                    src={userDetailsModal.sponsorImage}
                    className="profile_img"
                  />
                  <p className="name">{userDetailsModal?.sponsorName} </p>
                  <p className="designationName">
                    {userDetailsModal?.designationName}
                  </p>
                  <p className="description_details_modal px-2 my-2">
                    {userDetailsModal?.description}
                  </p>
                </>
              ) : (
                <>
                  <p className="title my-2">Trainer Profile</p>
                  <img
                    variant="top"
                    src={userDetailsModal.trainersMasterImageUrl}
                    className="profile_img"
                  />
                  <p className="name">{userDetailsModal?.trainersMasterName}</p>
                  <p className="designationName">
                    {userDetailsModal.designationName}
                  </p>
                  <p className="description_details_modal px-2 my-2">
                    {userDetailsModal?.description}
                  </p>
                </>
              )}
            </div>
          </Col>
        </ModalBody>

        <ModalFooter>
          <Col xs={12} className="text-center mb-2">
            <Button
              outline
              type="reset"
              onClick={closeDetails}
              className="close_details_modal"
            >
              Close
            </Button>
          </Col>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ShowDetailsModal
