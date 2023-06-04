import ReactPaginate from 'react-paginate'
import { Input } from 'reactstrap'

export const CustomPagination = ({
  pageProps,
  handlePageSizeChange,
  handlePageNoChange
}) => {
  const { totalPages, pageNo, pageSize } = pageProps
  const count = Number(Math.ceil(totalPages / pageSize))
  return (
    <>
      <div className="d-flex align-items-center justify-content-lg-start">
        <label className="ms-2" htmlFor="rows-per-page">
          Show
        </label>
        <Input
          className="mx-50"
          type="select"
          id="rows-per-page"
          value={pageSize}
          onChange={(e) => handlePageSizeChange(e)}
          style={{ width: '5rem' }}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </Input>
        /&nbsp;{totalPages}&nbsp;&nbsp;
        <label htmlFor="rows-per-page">Entries</label>
        <ReactPaginate
          className="pagination react-paginate justify-content-end w-100 my-2 pe-1 "
          previousLabel={''}
          nextLabel={''}
          pageCount={count || 1}
          activeClassName="active"
          forcePage={pageNo !== 0 ? pageNo - 1 : 0}
          onPageChange={handlePageNoChange}
          pageClassName={'page-item'}
          nextLinkClassName={'page-link'}
          nextClassName={'page-item next'}
          previousClassName={'page-item prev'}
          previousLinkClassName={'page-link'}
          pageLinkClassName={'page-link'}
          containerClassName={
            'pagination react-paginate justify-content-end my-2 pe-1'
          }
        />
      </div>
    </>
  )
}
export default CustomPagination
