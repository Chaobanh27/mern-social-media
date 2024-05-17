import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import App from '../App'
import Auth from '../pages/Auth/Auth'
import NotFound from '../pages/404/NotFound'
import AccountVerification from '../pages/Auth/AccountVerification'
import ProtectedRoute from './ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '',
        element: <ProtectedRoute/>,
        children: [
          {
            path: '',
            element: <Home/>
          }
        ]
      },
      {
        path: 'login',
        element: <Auth/>
      },
      {
        path: 'account/verification',
        element: <AccountVerification/>
      },
      {
        path: 'register',
        element: <Auth/>
      },
      {
        path: '*',
        element: <NotFound/>
      }
    ]
  }
])

export default router


