import React, { Component, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getSAMLURL } from '../redux/authentication'

function Redirect() {
  const dispatch = useDispatch()

  useEffect(async () => {
    const URL = await dispatch(getSAMLURL())
    window.location.replace(URL?.payload?.redirectURL)
  }, [])

  return <></>
}

function Response() {
  return <></>
}

export { Redirect, Response }
