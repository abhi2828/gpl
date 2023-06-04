import React from 'react'
import { Trash } from 'react-feather'

export const DeleteIcon = ({ openDeleteModal, data, enable }) => {
  return <Trash className="font-medium-2" onClick={openDeleteModal} />
}
