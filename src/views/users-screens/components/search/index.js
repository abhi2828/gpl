import React from 'react'
import { Search } from 'react-feather'
import '../../sass/search.scss'

const SearchField = () => {
  return (
    <div className="search pointer">
      <Search size={14} />
    </div>
  )
}

export default SearchField
