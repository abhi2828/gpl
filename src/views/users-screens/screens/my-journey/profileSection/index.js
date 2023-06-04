import React, { useState, useEffect } from 'react'
import '../../../sass/talent-philosophy/chros-desk.scss'
import img from '@src/assets/images/userScreen/pic1.png'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserEnroll, fetchUserInfo, setLoader } from '../store'
import Detail from '../../../components/detail'
import Spinner from '@components/spinner/Loading-spinner'
import { ProfileImage } from '../../../../../@core/layouts/components/ProfileName'

const ProfileSection = () => {
  const { userInfo, loader } = useSelector((state) => state?.myJourney)
  console.log(userInfo[0])
  const info = userInfo ? userInfo?.[0] : null
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [])

  return (
    <div className="chrosDesk">
      <div className="chrosDesk_sec">
        <div className="chrosDesk_sec-div">
          <>
            <div className="profile-image">
              <ProfileImage
                className="chrosDesk_sec-div-img"
                firstName={info?.firstName ?? ''}
                lastName={info?.lastName ?? ''}
              />
            </div>

            <h5>
              {info?.firstName ?? ''} {info?.lastName ?? ''}
            </h5>
          </>
        </div>
        <div className="chrosDesk_sec-div2">
          <Detail name="EDP:" description={info?.employeeId} />
          <Detail name="Position Title:" description={info?.jobTitle} />
          {/* <Detail name="Job Title:" description={e?.jobTitle} /> */}
          <Detail
            name="Email:"
            description={info?.businessEmailInformationEmailAddress}
          />
          <Detail name="Zone:" description={info?.subBusinessUnitName} />
          <Detail
            name="Grade:"
            description={info?.salaryGradeSalaryGradeName}
          />
          <Detail name="Region:" description={info?.subBusinessUnitName} />
          {/* <Detail
                  name="Sub Region Name:"
                  description={info?.empJobInfoTCustomVchar15}
                /> */}
          <Detail name="Function:" description={info?.functionName} />
          <Detail
            name="Department:"
            description={info?.departmentDepartmentName}
          />
          <Detail name="Level:" description={info?.level} />
          {/* <Detail name="Learning Wallet:" description={'10,000'} /> */}
        </div>
      </div>

      {/* {userInfo?.map((e) => {
          return (
            
          )
        })} */}
    </div>
  )
}

export default ProfileSection
