import React from 'react'
import { Menu } from 'react-feather'
import '../../sass/burger.scss'

const Hamburger = () => {
  return (
    <div className="burger">
      <Menu style={{ color: 'gray' }} size={24} />
    </div>
  )
}

export default Hamburger
