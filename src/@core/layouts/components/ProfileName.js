import React from "react"
export const ProfileImage = ({ firstName, lastName }) => {
    
    const initials = `${firstName?.charAt(0)?.toUpperCase()}${lastName?.charAt(0)?.toUpperCase()}`
  
    return (
        <span>{initials}</span>
    )
  }