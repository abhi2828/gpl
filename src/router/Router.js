// ** Router imports
import { Navigate, useRoutes } from 'react-router-dom'

// ** GetRoutes
import { getRoutes } from './routes'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'
import { getHomeRouteForLoggedInUser } from '../utility/Utils'

const Router = () => {
  // ** Hooks
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)
  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRouteForLoggedInUser()} />
    },
    ...allRoutes
  ])

  return routes
}

export default Router
