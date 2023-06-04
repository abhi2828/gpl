import React from 'react'
import { useState } from 'react'
import { Document, Page } from 'react-pdf'

const PdfView = ({ getFileName }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  // const renderPages = () => {
  //   return Array.from({ length: numPages }, (_, i) => (
  //     <Page key={i + 1} pageNumber={i + 1} />
  //   ))
  // }

  const pageButtons = []

  for (let i = 1; i <= numPages; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => setPageNumber(i)}
        style={
          pageNumber === i
            ? {
                backgroundColor: '#6fa624',
                color: 'white',
                borderRadius: '15px',
                border: 'none',
                height: '31px',
                width: '31px'
              }
            : {
                backgroundColor: '#0077b9',
                color: 'white',
                borderRadius: '15px',
                border: 'none',
                height: '31px',
                width: '31px'
              }
        }
      >
        {i}
      </button>
    )
  }

  function handleNextPage() {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1)
    }
  }

  function handlePrevPage() {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  return (
    <div
      className="pdf-viewer-container"
      style={{ width: '100%', overflow: 'hidden' }}
    >
      <div
        className="pdf-viewer-wrapper"
        style={{ width: '100%', paddingTop: '171px' }}
      >
        <Document
          file={{
            url: getFileName
          }}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {/* {renderPages()} */}
          <Page pageNumber={pageNumber} />
        </Document>
        {/* <div
          style={{
            gridRow: '1/2',
            display: 'grid',
            gap: '10px',
            gridAutoFlow: 'column'
          }}
        >
          {pageButtons}
        </div> */}
        <div
          style={{
            gridRow: '1/2',
            display: 'grid',
            gap: '10px',
            gridAutoFlow: 'column',
            height: '31px'
          }}
        >
          <button
            style={
              pageNumber <= 1
                ? {
                    backgroundColor: 'gray',
                    color: 'white',
                    borderRadius: '15px',
                    border: 'none',
                    height: '31px',
                    width: '31px',
                    cursor: 'not-allowed'
                  }
                : {
                    backgroundColor: '#0077b9',
                    color: 'white',
                    borderRadius: '15px',
                    border: 'none',
                    height: '31px',
                    width: '31px'
                  }
            }
            onClick={handlePrevPage}
            disabled={pageNumber <= 1}
          >
            {'<<'}
          </button>
          {pageButtons.length <= 5 ? (
            pageButtons
          ) : (
            <div
              style={{
                display: 'grid',
                gap: '10px',
                gridAutoFlow: 'column',
                alignItems: 'center',
                height: '30px'
              }}
            >
              {pageNumber !== 1 && (
                <div
                  style={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gap: '5px'
                  }}
                >
                  <span
                    style={{
                      height: '3px',
                      width: '3px',
                      backgroundColor: 'gray',
                      borderRadius: '2px'
                    }}
                  ></span>
                  <span
                    style={{
                      height: '3px',
                      width: '3px',
                      backgroundColor: 'gray',
                      borderRadius: '2px'
                    }}
                  ></span>
                  <span
                    style={{
                      height: '3px',
                      width: '3px',
                      backgroundColor: 'gray',
                      borderRadius: '2px'
                    }}
                  ></span>
                </div>
              )}
              {pageNumber !== 1 && (
                <button
                  style={{
                    backgroundColor: '#0077b9',
                    color: 'white',
                    borderRadius: '15px',
                    border: 'none',
                    height: '31px',
                    width: '31px'
                  }}
                  onClick={() => setPageNumber(pageNumber - 1)}
                >
                  {pageNumber - 1}
                </button>
              )}
              <button
                style={{
                  backgroundColor: '#6fa624',
                  color: 'white',
                  borderRadius: '15px',
                  border: 'none',
                  height: '31px',
                  width: '31px'
                }}
              >
                {pageNumber}
              </button>
              {pageNumber !== numPages && (
                <button
                  style={{
                    backgroundColor: '#0077b9',
                    color: 'white',
                    borderRadius: '15px',
                    border: 'none',
                    height: '31px',
                    width: '31px'
                  }}
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  {pageNumber + 1}
                </button>
              )}
              {pageNumber !== numPages && (
                <div
                  style={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gap: '5px'
                  }}
                >
                  <span
                    style={{
                      height: '3px',
                      width: '3px',
                      backgroundColor: 'gray',
                      borderRadius: '2px'
                    }}
                  ></span>
                  <span
                    style={{
                      height: '3px',
                      width: '3px',
                      backgroundColor: 'gray',
                      borderRadius: '2px'
                    }}
                  ></span>
                  <span
                    style={{
                      height: '3px',
                      width: '3px',
                      backgroundColor: 'gray',
                      borderRadius: '2px'
                    }}
                  ></span>
                </div>
              )}
            </div>
          )}
          <button
            style={
              pageNumber >= numPages
                ? {
                    backgroundColor: 'gray',
                    color: 'white',
                    borderRadius: '15px',
                    border: 'none',
                    height: '31px',
                    width: '31px',
                    cursor: 'not-allowed'
                  }
                : {
                    backgroundColor: '#0077b9',
                    color: 'white',
                    borderRadius: '15px',
                    border: 'none',
                    height: '31px',
                    width: '31px'
                  }
            }
            onClick={handleNextPage}
            disabled={pageNumber >= numPages}
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PdfView
