import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PageContainer from '../../shared/ui/PageContainer'
import Input from '../../shared/ui/Input'
import Button from '../../shared/ui/Button'
import { loginUser } from '../../features/auth/authService'
import { buildAuthSession } from '../../features/auth/authMapper'
import { ROUTES } from '../../shared/constants/routes'
import { useAuth } from '../../shared/hooks/useAuth'
import {
  getSessionNotice,
  clearSessionNotice,
} from '../../shared/utils/sessionNotice'

const INITIAL_FORM = {
  email: '',
  password: '',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [sessionNotice, setSessionNoticeState] = useState('')

  useEffect(() => {
    const notice = getSessionNotice()

    if (notice) {
      setSessionNoticeState(notice)
      clearSessionNotice()
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const loginResponse = await loginUser(formData)
      const authSession = buildAuthSession(loginResponse)

      login(authSession)

      const role = authSession?.user?.role

      if (role === 'ADMIN') {
        navigate(ROUTES.ADMIN_DASHBOARD)
        return
      }

      if (role === 'MANAGER') {
        navigate(ROUTES.MANAGER_DASHBOARD)
        return
      }

      navigate(ROUTES.EMPLOYEE_DASHBOARD)
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Login failed. Please check your credentials and try again.'

      setErrorMessage(serverMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated) {
    if (user?.role === 'ADMIN') {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
    }

    if (user?.role === 'MANAGER') {
      return <Navigate to={ROUTES.MANAGER_DASHBOARD} replace />
    }

    return <Navigate to={ROUTES.EMPLOYEE_DASHBOARD} replace />
  }

  return (
    <div className="mx-auto max-w-xl py-12">
      <PageContainer
        title="Login"
        description="Sign in to access the EMS platform."
      >
        {sessionNotice ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {sessionNotice}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          {errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </PageContainer>
    </div>
  )
}