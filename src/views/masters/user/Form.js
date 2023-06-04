import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import {
  emailRegex,
  formatDate,
  phoneRegex
} from '../../../../src/utility/Utils'
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
import classnames from 'classnames'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import {
  addUser,
  editUser,
  fetchUserDropdown,
  selectUser,
  setLoader
} from './store'
import { SpecialCharactersFieldValidion } from '../../../utility/Commonfunction'
import { TEXT_AREA_PLACEHOLDER } from '../../../utility/constants'
import { fetchDepartmentsDropdown } from '../functions/store'
import { fetchDesignationDropdown } from '../designation/store'
import { fetchLevelDropdown } from '../level/store'
import { getRolesDropdown } from '../../roles-permission/roles/store'

const defaultValues = {}

const GENDER = [
  { label: 'Female', value: 'FEMALE' },
  { label: 'Male', value: 'MALE' },
  { label: 'Other', value: 'OTHER' }
]
const AddForm = ({ setShow }) => {
  const { loader, selected, params } = useSelector((state) => state?.userMaster)
  const dispatch = useDispatch()
  const {
    reset,
    control,
    setError,
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleModalClosed = () => {
    setShow(false)
    reset()
    dispatch(selectUser(null))
  }
  const { designationDropdown } = useSelector(
    (state) => state?.designationMaster
  )
  const { departmentsDropdown } = useSelector((state) => state?.functions)
  const { leveldropdown } = useSelector((state) => state?.levelMaster)
  const { rolesDropdown } = useSelector((state) => state?.roles)
  const [isDisabled, setIsDisabled] = useState(false)
  const roleOptions = rolesDropdown?.map((masterModule) => {
    return {
      label: masterModule.roleName,
      value: masterModule.id
    }
  })
  const designationOptions = designationDropdown?.map((masterModule) => {
    return {
      label: masterModule.name,
      value: masterModule.id
    }
  })

  const levelOptions = leveldropdown?.map((masterModule) => {
    return {
      label: masterModule.levelName,
      value: masterModule.id
    }
  })
  const departmentsOptions = departmentsDropdown?.map((masterModule) => {
    return {
      label: masterModule.name,
      value: masterModule.id
    }
  })
  const onSubmit = async (data) => {
    let response = null
    if (selected) {
      await dispatch(setLoader(true))
      response = await dispatch(
        editUser({
          payload: {
            id: selected?.id,
            name: data.name,
            gender: data.gender,
            phoneNumber: data.phoneNumber,
            // departmentId: data?.departmentName?.value,
            // levelId: data?.levelName?.value,
            // designationId: data?.designationId?.value,
            roleId: data?.roleName?.map((elem) => elem.value)
          },
          params
        })
      )
    } else {
      await dispatch(setLoader(true))
      response = await dispatch(
        addUser({
          data: {
            name: data.name,
            gender: data.gender,
            email: data.email,
            phoneNumber: data.phoneNumber,
            roleId: data?.roleName?.map((elem) => elem.value)
          },
          params
        })
      )
    }

    if (response.payload) {
      handleModalClosed()
    }
  }

  useEffect(() => {
    dispatch(fetchDepartmentsDropdown())
    dispatch(fetchDesignationDropdown())
    dispatch(fetchLevelDropdown())
    dispatch(getRolesDropdown())
  }, [])

  useEffect(() => {
    if (selected) {
      const roleId = rolesDropdown.filter(
        (elem) => elem.roleName === selected.roleName
      )
      let id
      roleId.map((e) => (id = e.id))

      const {
        departmentId,
        departmentName,
        designationId,
        designationName,
        levelName,
        levelId,
        roleName
      } = selected
      if (departmentId) {
        setValue('designationId', {
          label: designationName,
          value: designationId
        })
      }
      if (departmentId) {
        setValue('departmentName', {
          label: departmentName,
          value: departmentId
        })
      }
      if (levelId) {
        setValue('levelName', {
          label: levelName,
          value: levelId
        })
      }
      if (roleName) {
        setValue('roleName', [
          {
            label: selected.roleName,
            value: id
          }
        ])
      }
      setValue('name', selected?.name)
      setValue('gender', selected?.gender)
      setValue('email', selected?.email)
      setIsDisabled(true)
      setValue('phoneNumber', selected?.phoneNumber)
    }
  }, [rolesDropdown])

  return (
    <>
      <Modal
        isOpen={true}
        onClosed={handleModalClosed}
        toggle={handleModalClosed}
        className="modal-dialog-centered"
      >
        <ModalHeader
          className="bg-transparent "
          toggle={handleModalClosed}
        ></ModalHeader>
        <ModalBody>
          <div className="text-center mb-0">
            <h1 className="mb-0">{selected ? 'Edit' : 'Add'} User</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="Users">
                  User Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="name"
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter User Name"
                      {...register('name', {
                        maxLength: '100',
                        required: 'User name is required',
                        validate: SpecialCharactersFieldValidion // Add the custom validation rule
                      })}
                      invalid={errors.name ? true : false}
                      {...field}
                    />
                  )}
                />
                {errors && errors.name && (
                  <FormFeedback>{errors.name.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <Label className="form-label" for="UserName">
                  Email <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: emailRegex,
                          message: 'Please enter valid email address'
                        }
                      })}
                      invalid={errors.email}
                      placeholder="Enter email"
                      disabled={isDisabled}
                      {...field}
                    />
                  )}
                />
                {errors && errors.email && (
                  <FormFeedback>{errors.email.message}</FormFeedback>
                )}
              </div>

              <div className="mb-1">
                <Label className="form-label" for="UserName">
                  Mobile Number <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="phoneNumber"
                      {...register('phoneNumber', {
                        required: 'Phone number is required',
                        pattern: {
                          value: phoneRegex,
                          message: 'Please enter valid phone number'
                        }
                      })}
                      placeholder="Enter mobile number"
                      invalid={errors.phoneNumber}
                      {...field}
                    />
                  )}
                />
                {errors && errors.phoneNumber && (
                  <FormFeedback>{errors.phoneNumber.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <Label className="form-label" for="UserName">
                  Gender <span className="text-danger">*</span>
                </Label>
                <Controller
                  // id="gender"
                  // name="gender"
                  // control={control}
                  // rules={{ required: 'Gender is required' }} // add a required rule
                  // render={({ field }) => (
                  //   <Select
                  //     type="select"
                  //     id="gender"
                  //     isClearable={true}
                  //     options={GENDER}
                  //     placeholder="Select gender"
                  //     classNamePrefix="select"
                  //     invalid={errors.gender}
                  //     theme={selectThemeColors}
                  //     className={classnames('react-select', {
                  //       'is-invalid': errors.gender
                  //     })}
                  //     {...field}
                  //   ></Select>
                  // )}

                  id="gender"
                  name="gender"
                  control={control}
                  {...register('gender', {
                    required: 'Please enter User gender'
                  })}
                  render={({ field }) => (
                    <Input
                      type="select"
                      id="gender"
                      invalid={errors.gender && true}
                      {...field}
                    >
                      <option selected>Select Gender</option>
                      {GENDER.map((gender) => {
                        return (
                          <option key={gender.value} value={gender.value}>
                            {gender.label}
                          </option>
                        )
                      })}
                    </Input>
                  )}
                />
                {errors && errors.gender && (
                  <FormFeedback>{errors.gender.message}</FormFeedback>
                )}
              </div>
              {/* <div className="mb-1">
                <Label className="form-label" for="department">
                  Department <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="departmentName"
                  name="departmentName"
                  control={control}
                  rules={{ required: 'Department is required' }} // add a required rule
                  render={({ field }) => (
                    <Select
                      isClearable={true}
                      placeholder="Select department"
                      classNamePrefix="select"
                      options={departmentsOptions}
                      theme={selectThemeColors}
                      className={classnames('react-select', {
                        'is-invalid': errors.departmentName
                      })}
                      {...field}
                    />
                  )}
                />
                {errors.departmentName && (
                  <FormFeedback>{errors.departmentName.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <Label className="form-label" for="designationId">
                  Designation <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="designationId"
                  name="designationId"
                  control={control}
                  rules={{ required: 'Designation is required' }} // add a required rule
                  render={({ field }) => (
                    <Select
                      isClearable={true}
                      placeholder="Select designation"
                      classNamePrefix="select"
                      options={designationOptions}
                      theme={selectThemeColors}
                      invalid={errors.designationId}
                      className={classnames('react-select', {
                        'is-invalid': errors.designationId
                      })}
                      {...field}
                    />
                  )}
                />
                {errors.designationId && (
                  <FormFeedback>{errors.designationId.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <Label className="form-label" for="designationId">
                  Level <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="levelName"
                  name="levelName"
                  control={control}
                  rules={{ required: 'Level is required' }} // add a required rule
                  render={({ field }) => (
                    <Select
                      isClearable={true}
                      placeholder="Select level"
                      classNamePrefix="select"
                      options={levelOptions}
                      theme={selectThemeColors}
                      invalid={errors.levelName}
                      className={classnames('react-select', {
                        'is-invalid': errors.levelName
                      })}
                      {...field}
                    />
                  )}
                />
                {errors.levelName && (
                  <FormFeedback>{errors.levelName.message}</FormFeedback>
                )}
              </div> */}
              <div className="mb-1">
                <Label className="form-label" for="designationId">
                  Role <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="roleName"
                  name="roleName"
                  control={control}
                  rules={{ required: 'Role is required' }} // add a required rule
                  render={({ field }) => (
                    <Select
                      isClearable={true}
                      isMulti={true}
                      placeholder="Select role"
                      classNamePrefix="select"
                      options={roleOptions}
                      theme={selectThemeColors}
                      invalid={errors.roleName}
                      className={classnames('react-select', {
                        'is-invalid': errors.roleName
                      })}
                      {...field}
                    />
                  )}
                />
                {errors.roleName && (
                  <FormFeedback>{errors.roleName.message}</FormFeedback>
                )}
              </div>
            </Col>
            <Col xs={12} className="text-center mt-2 mb-1">
              <Button
                className="me-1"
                color="primary"
                type="submit"
                disabled={loader}
              >
                {loader ? (
                  <Spinner text="Loading..." color="white" size="sm" />
                ) : (
                  'Submit'
                )}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  )
}

export default AddForm
