import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '../../components/PageLoadingSpinner'
import { verifyUserAPI } from '../../common'

const AccountVerification = () => {
  let [searchParams] = useSearchParams()
  // eslint-disable-next-line no-console
  const { email, token } = Object.fromEntries([...searchParams])

  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])

  if (!email || !token) {
    return <Navigate to="/404" />
  }

  if (!verified) {
    return <PageLoadingSpinner caption="Verifying your account..." />
  }

  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification