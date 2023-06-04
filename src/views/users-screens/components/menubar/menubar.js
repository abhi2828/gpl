import React from 'react'
import { set } from 'react-hook-form'
import { Link, NavLink } from 'react-router-dom'
import '../../sass/menubar.scss'
import { useDispatch } from 'react-redux'
import { handleLogout } from '../../../../redux/authentication'

const Menubar = ({ setOpen, open }) => {
  const dispatch = useDispatch()
  const Logout = () => {
    dispatch(handleLogout())
    setOpen(!open)
  }
  return (
    <div className="menubar_outer" onClick={() => setOpen(!open)}>
      <div className="menubar">
        <NavLink
          className={({ isActive }) =>
            isActive ? 'menubar_link-active' : 'menubar_link'
          }
          to="/dashboard"
          onClick={() => setOpen(!open)}
        >
          Home
        </NavLink>{' '}
        <NavLink
          className={({ isActive }) =>
            isActive ? 'menubar_link-active' : 'menubar_link'
          }
          to="/user-learning-tracks"
          onClick={() => setOpen(!open)}
        >
          Learning
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? 'menubar_link-active' : 'menubar_link'
          }
          to="/user-talent-philosophy"
          onClick={() => setOpen(!open)}
        >
          Careers
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? 'menubar_link-active' : 'menubar_link'
          }
          to="/my-journey"
          onClick={() => setOpen(!open)}
        >
          My Journey
        </NavLink>
        <NavLink className="menubar_link" to="/login" onClick={Logout}>
          Logout
        </NavLink>
      </div>
    </div>
  )
}

export default Menubar
