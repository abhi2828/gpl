import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

export const HorizontalStepper = ({ steps, activeStep }) => {
  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>
              <div className="probability_progress-label">{label}</div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

export default HorizontalStepper
