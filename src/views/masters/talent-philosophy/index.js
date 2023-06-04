import { Switch } from '@mui/material'

// ** React Imports
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import { Button, Card } from 'reactstrap'
import { updateCareerAspConfig } from '../../../redux/authentication'
import Banner from './Banner'
import CHROForm from './CHROForm'
import { fetchChroList } from './store'

// ** Table Import
import Table from './Table'

const TalentPhilosophy = () => {
  const { userData } = useSelector((state) => state.auth)
  const { chroList, loader } = useSelector((state) => state.talentPhilosophy)
  const disabled = userData.updateCareerAspiration
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()

  const handlechro = () => {
    dispatch(fetchChroList())
    setIsOpen(true)
  }

  return (
    <Fragment>
      <Card>{/* <Banner /> */}</Card>
      <Card className="p-2 card-datatable">
        <div className="chroAdmin">
          <p className="acceptCA">Accept career aspiration</p>
          <Button
            color="primary"
            className="addBanner mb-sm-0"
            onClick={handlechro}
          >
            Update CHRO detail
          </Button>
        </div>

        <div className="d-flex align-items-center permissions-actions">
          <Switch
            checked={disabled}
            onChange={(e) => {
              dispatch(updateCareerAspConfig(e.target.checked))
            }}
          />
        </div>
      </Card>
      <Card>
        <div className="card-datatable app-user-list table-responsive">
          <Table />
        </div>
      </Card>

      <CHROForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </Fragment>
  )
}

export default TalentPhilosophy
