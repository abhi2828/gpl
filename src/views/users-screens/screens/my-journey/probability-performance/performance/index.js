import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import CustomHeader from '../../../../../../utility/commonComponents/CustomHeader'
import { Button } from 'reactstrap'
import '../../../../sass/my-journey/performance.scss'
import { ChevronDown, Star } from 'react-feather'
import { useSelector } from 'react-redux'
import PDFViewerModal from './PDFViewerModal'
import axios from 'axios'
import { baseUrl } from '../../../../../../app.config'
import { toast } from 'react-hot-toast'
import { Spinner } from 'react-bootstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const Performance = ({ track }) => {
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [viewLoading, setViewLoading] = useState({})
  const [shareLoading, setShareLoading] = useState({})
  const [viewCertificatePdf, setViewCertificatePdf] = useState('')
  const [disableBtn, setDisableBtn] = useState(false)
  // let memoShareLoading = useMemo(() => shareLoading, [shareLoading])

  const { userId, loader } = useSelector((state) => state?.myJourney)

  const { subTrackList } = track

  const handleClosePDFModal = () => {
    setShowPDFModal(false)
  }

  const customStyles = {
    header: {
      style: {
        fontSize: '16px', // Change font size
        color: 'red' // Change font color
      }
    }
  }

  const SubTrackCertificatePdf = (data) => {
    if (!data?.fileUrl || !data?.imageUrl) {
      setViewLoading({ [data.subTrackId]: true })
      setDisableBtn(true)
      const payload = {
        userId: userId,
        learningTrackId: track?.trackId,
        subTrackId: data.subTrackId
      }
      axios
        .get(
          baseUrl() +
            `/user_certificate/certificate?learningTrackId=${
              payload.learningTrackId
            }&userId=${payload.userId}&subTrackId=${
              payload.subTrackId ? payload.subTrackId : ''
            } `
        )
        .then((res) => {
          const urls = res.data.data
          if (urls) {
            setViewCertificatePdf(urls.pdfUrl)
          }
          setShowPDFModal(true)
        })
        .catch((e) => {
          toast.error(
            e?.response?.data?.message
              ? e?.response?.data?.message
              : 'server error'
          )
        })
        .finally(() => {
          setViewLoading({})
          setDisableBtn(false)
        })
    } else {
      setViewCertificatePdf(data.fileUrl)
      setShowPDFModal(true)
    }
  }
  const SubTrackCertificateImg = (data) => {
    if (!data?.fileUrl || !data?.imageUrl) {
      setShareLoading({ [data.subTrackId]: true })
      setDisableBtn(true)
      const payload = {
        userId: userId,
        learningTrackId: track?.trackId,
        subTrackId: data.subTrackId
      }
      axios
        .get(
          baseUrl() +
            `/user_certificate/certificate?learningTrackId=${
              payload.learningTrackId
            }&userId=${payload.userId}&subTrackId=${
              payload.subTrackId ? payload.subTrackId : ''
            } `
        )
        .then((res) => {
          setShareLoading(false)
          const urls = res.data.data
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${urls.imageUrl}`
          )
        })
        .catch((e) => {
          setShareLoading(false)
          toast.error(e?.response?.data?.message)
        })
        .finally(() => {
          setShareLoading({})
          setDisableBtn(false)
        })
    } else {
      setShareLoading(false)
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${data.imageUrl}`
      )
    }
  }

  let CTitle = 'Completed Date'
  let CfTitle = 'Certificate'
  console.log('CTitle', CTitle.length)

  const Columns = [
    {
      sortable: true,
      minWidth: '20%',
      name: <div className="headerTitle">Sub Track Name</div>,
      selector: 'subTrackName',
      cell: (row) => (row?.subTrackName ? row?.subTrackName : '-')
    },
    {
      sortable: true,
      minWidth: '16%',
      name: <div className="headerTitle">Start Date</div>,
      selector: 'startDate',
      cell: (row) => (row?.subStartDate ? row?.subStartDate : '-')
    },
    {
      sortable: true,
      minWidth: '16%',
      name: <div className="headerTitle">End Date</div>,
      selector: 'endDate',
      cell: (row) => (row?.subEndDate ? row?.subEndDate : '-')
    },
    {
      sortable: true,
      minWidth: '16%',
      name: (
        <div className="headerTitle" style={{ minWidth: '25%' }}>
          Completed Date
        </div>
      ),
      selector: 'completedDate',
      center: true,
      cell: (row) => (row?.completeDate ? row?.completeDate : '-')
    },
    {
      sortable: false,
      // minWidth: '16%',
      name: <div className="headerTitle">Star Performer</div>,
      selector: 'starPerformer',
      cell: (row) =>
        row?.startPemformer ? (
          <div className="performance_star">
            <Star size={20} fill="#FFC107" color="#FFC107" />
          </div>
        ) : (
          <div className="performance_star">
            <Star size={20} fill="gray" color="gray" />
          </div>
        )
    },
    {
      name: (
        <div className="headerTitle">
          {' '}
          {CfTitle?.length > 15 ? (
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="toolTip">
                  <div className="toolTip ">{CfTitle}</div>
                </Tooltip>
              }
            >
              <span className="text-capitalize headerTitle-span description chrosDesk_sec-div2-detail-description">
                {CfTitle}
              </span>
            </OverlayTrigger>
          ) : (
            <span className="text-capitalize chrosDesk_sec-div2-detail-description">
              {CfTitle}
            </span>
          )}
        </div>
      ),
      width: '16%',
      cell: (row) => {
        return row?.completeDate !== null ? (
          <div className="mywrapper">
            <div className="align-items-center permissions-actions">
              <button className={`btn sub_track_btn_enable `}>
                <span
                  onClick={() => {
                    !disableBtn && SubTrackCertificatePdf(row)
                  }}
                >
                  {!viewLoading?.[row.subTrackId] ? (
                    'View'
                  ) : (
                    <Spinner text="Loading..." color="white" size="sm" />
                  )}
                </span>
              </button>
              |
              <button className={`btn sub_track_btn_enable`}>
                <span
                  onClick={() => !disableBtn && SubTrackCertificateImg(row)}
                >
                  {!shareLoading?.[row.subTrackId] ? (
                    'Share'
                  ) : (
                    <Spinner text="Loading..." color="white" size="sm" />
                  )}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mywrapper">
            <div className="align-items-center permissions-actions">
              <button className={`btn sub_track_btn_disable`}>View</button>|
              <button className={`btn sub_track_btn_disable`}>Share</button>
            </div>
          </div>
        )
      }
    }
  ]

  let withCompleteDate = subTrackList.filter((x, i) => x.completeDate !== null)
  let withOutCompleteDate = subTrackList.filter(
    (x, i) => x.completeDate === null
  )
  let subTrackListSorted = [...withCompleteDate, ...withOutCompleteDate]

  const dataToRender = () => {
    return subTrackListSorted
  }

  return (
    <div className="performance">
      <h1>Performance Table</h1>
      <div className="react-dataTable">
        <DataTable
          pagination={false}
          subHeader={false}
          noHeader
          responsive
          highlightOnHover
          paginationServer
          //   progressComponent={<Spinner />}
          //   progressPending={loader}
          columns={Columns}
          customStyles={customStyles}
          data={dataToRender()}
          sortIcon={<ChevronDown />}
          className="react-dataTable"
        />
      </div>
      {console.log('viewCertificatePdf', viewCertificatePdf)}
      {viewCertificatePdf && (
        <PDFViewerModal
          // fileName={fileName}
          urlData={viewCertificatePdf}
          show={showPDFModal}
          handleClose={handleClosePDFModal}
        />
      )}
    </div>
  )
}

export default Performance
