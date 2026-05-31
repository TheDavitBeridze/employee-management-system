import { useEffect, useState } from 'react'
import Input from '../../shared/ui/Input'
import Button from '../../shared/ui/Button'
import PageSection from '../../shared/ui/PageSection'
import Select from '../../shared/ui/Select'

const INITIAL_FORM = {
  email: '',
  password: '',
  role: 'EMPLOYEE',
  firstName: '',
  lastName: '',
  personalNumber: '',
  phone: '',
  birthDate: '',
  hireDate: '',
  salary: '',
  departmentId: '',
  positionId: '',
}

function formatDateForInput(dateValue) {
  if (!dateValue) {
    return ''
  }

  return new Date(dateValue).toISOString().split('T')[0]
}

export default function StaffCreateForm({
  mode = 'create',
  initialValues = INITIAL_FORM,
  onSubmit,
  isSubmitting,
  departmentOptions,
  positionOptions,
  onCancel,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setFormData({
      email: initialValues?.email || '',
      password: '',
      role: initialValues?.role || 'EMPLOYEE',
      firstName: initialValues?.firstName || '',
      lastName: initialValues?.lastName || '',
      personalNumber: initialValues?.personalNumber || '',
      phone: initialValues?.phone || '',
      birthDate: formatDateForInput(initialValues?.birthDate),
      hireDate: formatDateForInput(initialValues?.hireDate),
      salary:
        initialValues?.salary !== undefined && initialValues?.salary !== null
          ? String(initialValues.salary)
          : '',
      departmentId: initialValues?.departmentId ? String(initialValues.departmentId) : '',
      positionId: initialValues?.positionId ? String(initialValues.positionId) : '',
    })
  }, [initialValues])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (
      !formData.email.trim() ||
      !formData.role ||
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.personalNumber.trim() ||
      !formData.phone.trim() ||
      !formData.birthDate ||
      !formData.hireDate ||
      !formData.departmentId ||
      !formData.positionId
    ) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    if (mode === 'create' && !formData.password.trim()) {
      setErrorMessage('Password is required for new staff.')
      return
    }

    let parsedSalary = null

    if (formData.salary.trim()) {
      parsedSalary = Number(formData.salary)

      if (Number.isNaN(parsedSalary) || parsedSalary < 0) {
        setErrorMessage('Salary must be a valid non-negative number.')
        return
      }
    }

    setErrorMessage('')

    const payload = {
      email: formData.email.trim(),
      role: formData.role,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      personalNumber: formData.personalNumber.trim(),
      phone: formData.phone.trim(),
      birthDate: formData.birthDate,
      hireDate: formData.hireDate,
      salary: parsedSalary,
      departmentId: Number(formData.departmentId),
      positionId: Number(formData.positionId),
    }

    if (mode === 'create' || formData.password.trim()) {
      payload.password = formData.password
    }

    const wasSuccessful = await onSubmit(payload)

    if (wasSuccessful && mode === 'create') {
      setFormData(INITIAL_FORM)
    }
  }

  return (
    <PageSection
      title={mode === 'create' ? 'Create Staff Member' : 'Update Staff Member'}
      description={
        mode === 'create'
          ? 'Create user and employee records together in one unified flow.'
          : 'Update user and employee data together in one unified flow.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />

          <Input
            label={mode === 'create' ? 'Password' : 'Password (Optional)'}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={
              mode === 'create'
                ? 'Enter password'
                : 'Leave empty to keep current password'
            }
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: 'EMPLOYEE', label: 'Employee' },
              { value: 'MANAGER', label: 'Manager' },
            ]}
            placeholder="Select role"
          />

          <Input
            label="Salary (Optional)"
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Optional custom salary"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />

          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Personal Number"
            name="personalNumber"
            value={formData.personalNumber}
            onChange={handleChange}
            placeholder="Enter personal number"
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Birth Date"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
          />

          <Input
            label="Hire Date"
            name="hireDate"
            type="date"
            value={formData.hireDate}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Department"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            options={departmentOptions}
            placeholder="Select department"
          />

          <Select
            label="Position"
            name="positionId"
            value={formData.positionId}
            onChange={handleChange}
            options={positionOptions}
            placeholder="Select position"
          />
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-wrap justify-end gap-3">
          {mode === 'edit' ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'create'
                ? 'Creating...'
                : 'Saving...'
              : mode === 'create'
              ? 'Create Staff Member'
              : 'Save Changes'}
          </Button>
        </div>
      </form>
    </PageSection>
  )
}