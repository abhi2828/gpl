import { useEffect } from 'react'
import { useRef } from 'react'

export const useAutoFocus = (inputs, index) => {
  const inputnameRefs = useRef([])

  inputnameRefs.current = inputs.map(
    (ref, index) => (inputnameRefs.current[index] = useRef())
  )

  useEffect(() => {
    if (inputnameRefs.current[0].current) {
      inputnameRefs.current[index].current.focus()
    }
  }, [inputnameRefs.current[0].current, index])

  return inputnameRefs
}
