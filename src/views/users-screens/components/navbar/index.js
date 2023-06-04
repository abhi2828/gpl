import React from 'react'
import { BrowserRouter, Routes, Route, NavLink, Outlet } from 'react-router-dom'
import '../../sass/navbar.scss'

const Navbar = () => {
  return (
    <div className="user-navbar">
      <div>
        {/* <li> */}
        <NavLink
          className={({ isActive }) =>
            isActive ? 'user-navbar_active' : 'user-navbar_navlink'
          }
          // activeClassName="navbar_active"
          to="/dashboard"
        >
          Home
        </NavLink>
        {/* </li> */}
        {/* <li> */}

        <NavLink
          className={({ isActive }) =>
            isActive ? 'user-navbar_active' : 'user-navbar_navlink'
          }
          to="/user-learning-tracks"
        >
          Learning
        </NavLink>
        {/* </li> */}
        {/* <li> */}
        <NavLink
          className={({ isActive }) =>
            isActive ? 'user-navbar_active' : 'user-navbar_navlink'
          }
          to="/user-talent-philosophy"
        >
          Careers
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? 'user-navbar_active' : 'user-navbar_navlink'
          }
          to="/my-journey"
        >
          My Journey
        </NavLink>
        {/* </li> */}
      </div>
    </div>
  )
}

export default Navbar
