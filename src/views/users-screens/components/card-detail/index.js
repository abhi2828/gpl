import React from 'react'
import '../../sass/card-detail.scss'
import Spinner from '@components/spinner/Loading-spinner'
import GreenDoubleQuotation from '../../../../assets/images/customIcon/GreenDoubleQuotation.svg'
import MaroonInvertedQuotes from '../../../../assets/images/customIcon/maroon_inverted_quotes.svg'
import BlueDoubleQuotation from '../../../../assets/images/customIcon/BlueDoubleQuotation.svg'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const DetailCard = ({ card, loader, i }) => {
  return (
    <div className="cardDetail">
      {loader ? (
        <Spinner />
      ) : (
        <>
          <div className="cardDetail_top">
            <img
              className="cardDetail_top-img"
              src={card?.imageUrl}
              alt="pic"
            />
            <div className="cardDetail_top-info">
              <div
                className="cardDetail_top-info-sec w-100"
                style={{ gap: '10px' }}
              >
                <div className="left-aligned">
                  <h5>{card?.userName ?? ''}</h5>
                  <p className="cardDetail_top-info-p">
                    <span style={{ display: 'inlinBlock' }}>
                      {card?.designationName ?? ''}{' '}
                    </span>
                    {card?.departmentName?.length > 5 ? (
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="toolTip">
                            <div className="toolTip ">
                              {card?.departmentName}
                            </div>
                          </Tooltip>
                        }
                      >
                        <span className="text-capitalize table_row description chrosDesk_sec-div2-detail-description">
                          {'- ' + card?.departmentName ?? ''}
                        </span>
                      </OverlayTrigger>
                    ) : (
                      <span className="text-capitalize chrosDesk_sec-div2-detail-description">
                        {'- ' + card?.departmentName ?? ''}
                      </span>
                    )}
                    {/* {card?.departmentName
                      ? '- ' + card?.designationName ?? ''
                      : ''} */}
                  </p>
                </div>
                <div className="right-aligned">
                  {i % 3 == 0 ? (
                    <img
                      src={MaroonInvertedQuotes}
                      className="testimonial_card_quotes"
                      alt=""
                    />
                  ) : i % 2 == 0 ? (
                    <img
                      src={BlueDoubleQuotation}
                      className="testimonial_card_quotes"
                      alt=""
                    />
                  ) : (
                    <img
                      src={GreenDoubleQuotation}
                      className="testimonial_card_quotes"
                      alt=""
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {loader ? (
        <Spinner />
      ) : (
        <>
          <div className="cardDetail_details fst-italic">
            {card?.testimonial}
          </div>
        </>
      )}
    </div>
  )
}

export default DetailCard
