import React from 'react'
import UserDropdown from '../../../../@core/layouts/components/navbar/UserDropdown'
import profile from '../../../../assets/images/userScreen/profile.png'
import '../../sass/Header.scss'

const Profile = () => {
  const handleDropdown = () => {}
  return (
    <div className="userProfile">
      {/* <img height="30px" width="auto" src={profile} alt="profile" className='pointer' onClick={handleDropdown}/> */}
      <UserDropdown />
    </div>
  )
}

export default Profile
