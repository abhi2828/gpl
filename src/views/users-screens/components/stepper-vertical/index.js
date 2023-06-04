import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

export const VerticalStepper = ({ steps, activeStep }) => {
  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

export default VerticalStepper
