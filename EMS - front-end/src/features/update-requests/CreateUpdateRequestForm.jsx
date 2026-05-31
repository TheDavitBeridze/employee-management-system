import { useState } from 'react'
import Input from '../../shared/ui/Input'
import Button from '../../shared/ui/Button'
import PageSection from '../../shared/ui/PageSection'

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
}

export default function CreateUpdateRequestForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
      form: '',
    }))
  }

  function validateForm() {
    const nextErrors = {}

    const hasAnyField = Object.values(formData).some((value) => value.trim() !== '')

    if (!hasAnyField) {
      nextErrors.form = 'At least one field must be filled.'
    }

    if (formData.firstName && (formData.firstName.length < 2 || formData.firstName.length > 50)) {
      nextErrors.firstName = 'First name must be 2-50 characters.'
    }

    if (formData.lastName && (formData.lastName.length < 2 || formData.lastName.length > 50)) {
      nextErrors.lastName = 'Last name must be 2-50 characters.'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Email must be valid.'
    }

    if (formData.email && formData.email.length > 120) {
      nextErrors.email = 'Email max length is 120.'
    }

    if (formData.password && (formData.password.length < 6 || formData.password.length > 72)) {
      nextErrors.password = 'Password must be 6-72 characters.'
    }

    if (formData.phone && (formData.phone.length < 9 || formData.phone.length > 20)) {
      nextErrors.phone = 'Phone number must be 9-20 characters.'
    }

    if (formData.phone && !/^[0-9+]*$/.test(formData.phone)) {
      nextErrors.phone = "Phone number can contain only digits and '+'."
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    const payload = {
      firstName: formData.firstName.trim() || null,
      lastName: formData.lastName.trim() || null,
      email: formData.email.trim() || null,
      password: formData.password.trim() || null,
      phone: formData.phone.trim() || null,
    }

    const wasSuccessful = await onSubmit(payload)

    if (wasSuccessful) {
      setFormData(INITIAL_FORM)
      setErrors({})
    }
  }

  return (
    <PageSection
      title="Create Update Request"
      description="Submit a request to update your personal profile information."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.form}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            placeholder="Enter new first name"
          />

          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            placeholder="Enter new last name"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter new email"
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="Enter new phone"
          />
        </div>

        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter new password"
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </PageSection>
  )
}