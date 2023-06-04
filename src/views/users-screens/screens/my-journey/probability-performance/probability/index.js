import React, { useState, useEffect } from 'react'
import '../../../../sass/my-journey/probability.scss'
import VerticalStepper from '../../../../components/stepper-vertical'
import HorizontalStepper from '../../../../components/stepper-horizontal'
// import VerticalStepper from '../../../../components/vertical-stepper/index'
const Probability = ({ track }) => {
  const { subTrackList } = track
  // const [activeStep, setActiveStep] = React.useState(1)
  const [width, setWidth] = useState(window.innerWidth)
  const [activeStep, setActiveStep] = useState(0)
  let withCompleteDate = subTrackList.filter((x, i) => x.completeDate !== null)
  let withOutCompleteDate = subTrackList.filter(
    (x, i) => x.completeDate === null
  )
  let subTrackListSorted = [...withCompleteDate, ...withOutCompleteDate]

  const isMobile = width <= 750
  const subTracks = subTrackListSorted.map((e) => e.subTrackName)
  const completeList = subTrackListSorted.map((e) => e.completeDate)
  // let activeStep = 0

  function handleWindowSizeChange() {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  useEffect(() => {
    if (completeList.includes(null)) {
      for (let i = 0; i < subTrackListSorted.length; i++) {
        if (subTrackListSorted[i].completeDate === null) {
          setActiveStep(i)
          break
        }
      }
    } else {
      setActiveStep(subTrackListSorted.length)
    }
  }, [subTrackListSorted])

  return (
    <div className="probability">
      <div className="probability_progress">
        {isMobile ? (
          <VerticalStepper steps={subTracks} activeStep={activeStep} />
        ) : (
          <HorizontalStepper steps={subTracks} activeStep={activeStep} />
        )}
      </div>
    </div>
  )
}

export default Probability
