import React, { useState } from 'react'
import '../../sass/Header.scss'
import godrej_logo from '../../../../assets/images/customIcon/GodrejLogo.png'
import Navbar from '../../components/navbar'
import Search from '../../components/search'
import Notification from '../../components/notification'
import Profile from '../../components/profile'
import Hamburger from '../../components/hamburger'
import Menubar from '../../components/menubar/menubar'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const [open, setOpen] = useState(false)
  const handleOpenMenu = () => {
    setOpen(!open)
  }

  let navigate = useNavigate()
  const handleRedirect = () => {
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  return (
    <div className="header">
      <div className="header_sec1" onClick={handleRedirect}>
        {/* <img className="header_sec1-img1" src={godrej} alt="godrej" />
        <div className="header_sec1-gpl">
          <img className="header_sec1-gpl-img1" src={gpl} alt="alchemy" />
          <img className="header_sec1-gpl-img2" src={alchemy} alt="alchemy" />
        </div> */}
        <img src={godrej_logo} alt="godrej_logo" />
      </div>
      <Navbar />
      <div className="header_sec2">
        {/* <Search />
        <Notification /> */}
        <Profile />
        <div className="header_sec3" onClick={handleOpenMenu}>
          <Hamburger />
        </div>
      </div>

      {open && <Menubar setOpen={setOpen} open={open} />}
    </div>
  )
}

export default Header
