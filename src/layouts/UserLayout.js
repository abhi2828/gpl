// ** React Imports
import { Outlet } from 'react-router-dom'

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/UserLayout'

// ** Menu Items Array
import navigation from '@src/navigation/user'
import { hasPermission } from '../utility/Utils'

const UserLayout = (props) => {
  const menuList = () => {
    let temp = [...navigation]

    temp = temp.filter((item) => {
      let bool = false
      item?.show?.map((per) => {
        bool = bool || hasPermission(per)
      })
      return bool
    })

    return temp
  }
  return (
    <Layout menuData={menuList()} {...props}>
      <Outlet />
    </Layout>
  )
}

export default UserLayout
