import React from 'react'

const PDFViewer = ({ pdf }) => {
  return (
    <>
      <object
        data={pdf}
        type="application/pdf"
        width="100%"
        height="100%"
        style={{ backgroundColor: 'red !important' }}
      />
    </>
  )
}

export default PDFViewer
