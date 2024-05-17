import { useLocation, Navigate } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/userSlice/userSlice'

const Auth = () => {
  const location = useLocation()

  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'

  const currentUser = useSelector(selectCurrentUser)
  if (currentUser) {
    return <Navigate to='/' replace={true} />
  }

  return (
    <>
      {isLogin && <Login/>}
      {isRegister && <Register/>}
    </>
  )
}

export default Auth