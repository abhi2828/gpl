// import React, { useState } from 'react'
// import { Button, Input } from 'reactstrap'
// import { useSelector, useDispatch } from 'react-redux'
// // import { addBannerList } from './store'
// import { Col } from 'react-bootstrap'

// const Banner = () => {
//   const [banner, setBanner] = useState('')
//   const [mobileBanner, setMobileBanner] = useState('')
//   const dispatch = useDispatch()

//   const handleChange = (e) => {
//     setBanner(e.target.value)
//   }

//   const handleMobileUrlChange = (e) => {
//     setMobileBanner(e.target.value)
//   }

//   const handleUpload = () => {
//     if (banner !== '' || mobileBanner !== '') {
//       dispatch(
//         addBannerList({
//           imageUrl: banner,
//           mobileImageUrl: mobileBanner
//         })
//       )
//       setBanner('')
//       setMobileBanner('')
//     }
//   }

//   return (
//     <>
//       <div className='row'
//         style={{
//           // display: 'flex',
//           // gridAutoFlow: 'column',
//           // gridTemplateColumns: '5fr 1fr',
//           padding: '1rem 2rem',
//           // gap: '6rem'
//         }}
//       >
//         <Col sm={5} display="flex">
//           <Input
//             id="bannerUrl"
//             name="bannerUrl"
//             type="text"
//             placeholder="Enter Website Banner Url"
//             onChange={handleChange}
//             value={banner}
//           />
//         </Col>

//         <Col sm={5} display="flex">
//           <Input
//             id="mobileUrl"
//             name="mobileUrl"
//             type="text"
//             placeholder="Enter Mobile Banner"
//             onChange={handleMobileUrlChange}
//             value={mobileBanner}
//           />
//         </Col>

//         <Col sm={2}>
//           <Button
//             onClick={handleUpload}
//             color="primary"
//             className="addBanner mb-sm-0"
//           >
//             Add Banner
//           </Button>
//         </Col>
//       </div>
//     </>
//   )
// }

// export default Banner
