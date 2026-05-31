import { useEffect, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import Card from '../../shared/ui/Card'
import EmptyState from '../../shared/ui/EmptyState'
import StatusBadge from '../../shared/ui/StatusBadge'
import { getMyProfile } from '../../features/profile/profileService'

function formatDate(dateValue) {
  if (!dateValue) {
    return '--'
  }

  return new Date(dateValue).toLocaleDateString()
}

function renderField(label, value) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm text-slate-700">{value || '--'}</p>
    </div>
  )
}

export default function ManagerProfilePage() {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getMyProfile()

        if (isMounted) {
          setProfile(responseData)
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load profile.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return <Loader text="Loading profile..." />
  }

  if (errorMessage) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Profile"
          description="Review your manager profile information."
        />
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Profile"
          description="Review your manager profile information."
        />
        <EmptyState
          title="Profile not found"
          description="Your profile information is not available."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Review your manager profile information."
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">
            {profile.firstName} {profile.lastName}
          </h2>
          <StatusBadge status={profile.status} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {renderField('Employee ID', profile.id)}
          {renderField('User ID', profile.userId)}
          {renderField('Personal Number', profile.personalNumber)}
          {renderField('Phone', profile.phone)}
          {renderField('Birth Date', formatDate(profile.birthDate))}
          {renderField('Hire Date', formatDate(profile.hireDate))}
          {renderField('Department', profile.departmentName)}
          {renderField('Position', profile.positionName)}
          {renderField('Salary', profile.salary)}
          {renderField('Created At', formatDate(profile.createdAt))}
        </div>
      </Card>
    </div>
  )
}