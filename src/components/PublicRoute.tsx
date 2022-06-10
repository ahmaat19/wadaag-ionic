// create protected route

import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router'
import { RootState } from '../redux/store'

// @ts-ignore
const PublicRoute = ({ component: Component, ...rest }) => {
  const isAuth = useSelector((state: RootState) => state.user.isAuth)

  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuth ? <Component {...props} /> : <Redirect to='/home' />
      }
    />
  )
}

export default PublicRoute
