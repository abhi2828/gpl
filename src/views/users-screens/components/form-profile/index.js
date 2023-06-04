import classNames from 'classnames'
import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import toast from 'react-hot-toast'
// import { useForm, Controller } from 'react-hook-form'
// import { Editor } from 'react-draft-wysiwyg'
// import htmlToDraft from 'html-to-draftjs'
// import { EditorState, convertToRaw, ContentState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '@styles/react/libs/editor/editor.scss'
import '@styles/base/plugins/forms/form-quill-editor.scss'

import { Modal, ModalBody, ModalHeader, Spinner } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '../../sass/form-profile.scss'
import img from '@src/assets/images/userScreen/pic1.png'

const defaultValues = {
  name: '',
  curriculum: '',
  objective: '',
  startDate: '',
  endDate: '',
  sponsorId: [],
  trainerId: []
}
const ProfileForm = ({ setShow }) => {
  const handleModalClosed = () => {
    setShow(false)
  }
  return (
    <>
      <Modal
        isOpen={true}
        onClosed={handleModalClosed}
        toggle={handleModalClosed}
        className="modal-dialog-centered modal-lg"
      >
        <ModalBody>
          <div className="programForm">
            <h4>Sponsor Profile Screen</h4>
            <div className="programForm_div">
              <img
                className="programForm_div-img"
                src={img}
                alt="profile image"
              />
              <h5>Nisha Kumar</h5>
              <p>CEO</p>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur. Iaculis adipiscing neque
              ornare a nunc mi integer volutpat. Commodo facilisi volutpat lacus
              mauris. Aliquet urna adipiscing feugiat maecenas aliquet
              scelerisque quis duis sociis. Mauris commodo nisl volutpat
              vestibulum diam et sagittis risus cursus. Pulvinar eu sagittis
              maecenas eget odio diam in consectetur eget.
            </p>
            <input
              className="programForm_close"
              type="button"
              value="Close"
              onClick={handleModalClosed}
            />
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default ProfileForm
