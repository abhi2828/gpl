// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'
import '../../../../common.css'
// ** Third Party Components
import { User, Settings, Power } from 'react-feather'

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from 'reactstrap'

import { useDispatch, useSelector } from 'react-redux'
import { handleLogout } from '../../../../redux/authentication'
import { ProfileImage } from '../ProfileName'
// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import { useEffect, useState } from 'react'
import { isUserLoggedIn } from '../../../../utility/Utils'

const UserDropdown = () => {
  const dispatch = useDispatch()
  const [userData, setUserData] = useState(null)
  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])
  const fname = userData?.name?.trim()?.split(' ')[0] ?? ''
  const lname = userData?.name?.trim()?.split(' ')[1] ?? ''
  return (
    <UncontrolledDropdown className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        {/* <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">
            {(userData && userData['name']) || 'John Doe'} // need to hide this line for user login
          </span>
          <span className="user-status">
            {(userData && userData?.role?.join(', ')) || ''}
          </span>
        </div> */}
        {/* <Avatar
          img={<User size={20} />}
          imgHeight="40"
          imgWidth="40"
          status="online"
        /> */}
        {/* <User size={20} /> */}
        <div>
          <div className="profile-image_name">
            <ProfileImage
              className="chrosDesk_sec-div-img"
              firstName={fname}
              lastName={lname}
            />
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu end>
        {/* <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
          <User size={14} className="me-75" />
          <span className="align-middle">Profile</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem
          tag={Link}
          to="/pages/"
          onClick={(e) => e.preventDefault()}
        >
          <Settings size={14} className="me-75" />
          <span className="align-middle">Settings</span>
        </DropdownItem> */}
        <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
