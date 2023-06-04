import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import {
  Button,
  Form,
  Input,
  Label,
  Card,
  CardBody,
  FormFeedback,
  Table,
  Spinner
} from 'reactstrap'
import { updateRoles, addRoles, setLoader, selectRoles } from './store/index'
import { useState } from 'react'
import { ChevronLeft } from 'react-feather'
import { SpecialCharactersFieldValidion } from '../../../utility/Commonfunction'

const AddRole = ({ type, editData, setShow, pageSize, pageNo }) => {
  const [list, setList] = useState([])
  const permissionListValue = useSelector(
    (state) => state?.permissions?.permissionListByModule
  )
  const dispatch = useDispatch()
  const [roleName, setRoleName] = useState('')
  const [description, setDescription] = useState('')
  const store = useSelector((state) => state.roles)
  const { loader, selected, params } = useSelector((state) => state?.roles)
  const defaultValues = {
    roleName: '',
    description: ''
  }
  const {
    reset,
    control,
    setError,
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleDiscard = () => {
    reset()
    dispatch(selectRoles(null))
    setShow(false)
  }

  const handleChange = (temp) => {
    let tempList = list.map((item) => {
      if (temp.id === item.id) {
        return {
          ...item,
          checked: item.checked ? false : true
        }
      } else {
        return item
      }
    })
    setList(tempList)
  }

  const onSubmit = async (data) => {
    let response = ''
    let arr = []
    list.forEach((item) => {
      item.permissionList.forEach((child) => {
        if (child?.checked) arr.push(child?.permissionId)
      })
    })
    if (selected) {
      await dispatch(setLoader(true))
      response = await dispatch(
        updateRoles({
          roleName: data?.roleName,
          description: data?.description,
          permissionId: arr,
          id: selected?.id,
          params
        })
      )
    } else {
      await dispatch(setLoader(true))
      response = await dispatch(
        addRoles({
          roleName: data?.roleName,
          description: data?.description,
          permissionId: arr,
          params
        })
      )
    }
    if (response) {
      setShow(false)
      reset()
      dispatch(selectRoles(null))
    }
  }

  useEffect(() => {
    if (selected) {
      setValue('roleName', selected?.roleName)
      setValue('description', selected?.description)
    }
  }, [])

  useEffect(() => {
    if (permissionListValue.length > 0) {
      if (selected) {
        let listOfIDs = store?.permissionsOfRole?.map((temp) => {
          return temp.permissionId
        })

        let finalList = permissionListValue?.map((item) => {
          var obj = { ...item }

          var bool = true
          obj.permissionList = item.permissionList?.map((child) => {
            bool = bool & listOfIDs?.includes(child?.permissionId)
            return {
              ...child,
              checked: listOfIDs?.includes(child?.permissionId)
            }
          })
          return {
            ...obj,
            checked: bool
          }
        })
        setList(finalList)
      } else {
        setList(permissionListValue)
      }
    }
  }, [permissionListValue.length])

  const handleParentChange = (parent) => {
    const newValue = list.map((temp) => {
      var obj = { ...temp }

      if (temp.moduleId === parent.moduleId) {
        obj.permissionList = temp.permissionList.map((item) => {
          return {
            ...item,
            checked:
              temp.moduleId === parent.moduleId ? !obj.checked : obj.checked
          }
        })
        obj.checked = !obj.checked
      }

      return obj
    })

    setList(newValue)
  }

  const handleChildChange = (parent, child) => {
    const newValue = list.map((temp) => {
      var obj = { ...temp }
      var bool = true
      if (temp.moduleId === parent.moduleId) {
        obj.permissionList = temp.permissionList.map((item) => {
          bool =
            item.permissionId === child.permissionId
              ? bool & !item.checked
              : bool & item.checked
          return {
            ...item,
            checked:
              item.permissionId === child.permissionId
                ? !item.checked
                : item.checked
          }
        })
        obj.checked = bool
      }

      return obj
    })

    setList(newValue)
  }

  return (
    <div className="invoice-preview-wrapper p-1">
      <Card
        className="invoice-preview-card"
        tag={Form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <CardBody className="invoice-padding p-1" xs={12}>
          <p className="mt-0">
            <label
              onClick={() => {
                setShow(false), dispatch(selectRoles(null))
              }}
            >
              <ChevronLeft className="rotate-rtl me-15" size={14} />
              <span className="mb-2 link-btn">Back to list</span>
            </label>
          </p>
          <Label className="form-label" for="permission-name">
            Role Name <span className="text-danger">*</span>
          </Label>
          <Controller
            id="roleName"
            name="roleName"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Enter Role Name"
                onChange={(e) => setRoleName(e.target.value)}
                {...register('roleName', {
                  required: 'Please enter Role',
                  maxLength: 100,
                  validate: SpecialCharactersFieldValidion // Add the custom validation rule
                })}
                invalid={errors.roleName ? true : false}
                {...field}
              />
            )}
          />
          {errors && errors.roleName && (
            <FormFeedback>{errors.roleName.message}</FormFeedback>
          )}

          <br />

          <div className="mb-3">
            <Label className="form-label" for="description">
              Description <span className="text-danger">*</span>
            </Label>
            <Controller
              control={control}
              id="description"
              name="description"
              render={({ field }) => (
                <Input
                  placeholder="Enter Description"
                  onChange={(e) => setDescription(e.target.value)}
                  {...register('description', {
                    required: 'Please enter description'
                  })}
                  {...field}
                  invalid={errors.description && true}
                />
              )}
            />
            {errors && errors.description && (
              <FormFeedback>Please enter a valid Description</FormFeedback>
            )}
          </div>

          <Table className="table-flush-spacing" responsive>
            <tbody>
              {list.map((parent, index) => {
                return (
                  <tr key={index}>
                    <td className="text-nowrap ">
                      <Input
                        type="checkbox"
                        id={`module-${parent.moduleId}`}
                        checked={parent.checked}
                        onChange={() => handleParentChange(parent)}
                      />
                      <Label
                        className="form-check-label ps-1 fw-bolder"
                        for={`module-${parent.moduleId}`}
                      >
                        {parent.moduleName}
                      </Label>
                    </td>
                    <td className="text-nowrap">
                      <div className="d-flex flex-wrap">
                        {parent?.permissionList?.map((child) => (
                          <div
                            className="form-check width-500 mb-2"
                            key={child?.permissionId}
                          >
                            <Input
                              type="checkbox"
                              id={`child-${child?.permissionId}`}
                              checked={child?.checked}
                              onChange={() => handleChildChange(parent, child)}
                            />
                            <Label
                              className="form-check-label pl-8"
                              for={`child-${child?.permissionId}`}
                            >
                              {child?.method} - {child?.url} -{' '}
                              {child?.description}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>

          {errors && errors.roleName && (
            <FormFeedback>Please enter a valid Role Name</FormFeedback>
          )}
          <CardBody className="text-center">
            <Button
              className="me-1"
              disabled={loader}
              color="primary"
              type="submit"
              // onClick={() => onSubmit()}
            >
              {loader ? (
                <Spinner className="me-2 ms-2" color="white" size="sm" />
              ) : (
                `${selected ? 'Edit' : 'Add'} Role`
              )}
              {/* {type === 'Edit' ? 'Update ' : 'Create '} Role */}
            </Button>
            <Button
              outline
              type="reset"
              disabled={loader}
              onClick={() => handleDiscard()}
            >
              Discard
            </Button>
          </CardBody>
        </CardBody>

        {/* </Row> */}
      </Card>
    </div>
  )
}

export default AddRole
