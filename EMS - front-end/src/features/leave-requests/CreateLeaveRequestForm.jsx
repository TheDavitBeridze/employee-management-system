import { useState } from 'react'
import Input from '../../shared/ui/Input'
import Button from '../../shared/ui/Button'
import PageSection from '../../shared/ui/PageSection'

const INITIAL_FORM = {
  startDate: '',
  endDate: '',
  reason: '',
}

export default function CreateLeaveRequestForm({ onSubmit, isSubmitting }) {
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
    }))
  }

  function validateForm() {
    const nextErrors = {}

    if (!formData.startDate) {
      nextErrors.startDate = 'Start date is required.'
    }

    if (!formData.endDate) {
      nextErrors.endDate = 'End date is required.'
    }

    if (!formData.reason.trim()) {
      nextErrors.reason = 'Reason is required.'
    } else if (formData.reason.trim().length > 500) {
      nextErrors.reason = 'Reason must be 500 characters or less.'
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      nextErrors.endDate = 'End date cannot be earlier than start date.'
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
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason.trim(),
    }

    const wasSuccessful = await onSubmit(payload)

    if (wasSuccessful) {
      setFormData(INITIAL_FORM)
      setErrors({})
    }
  }

  return (
    <PageSection
      title="Create Leave Request"
      description="Submit a new leave request for manager review."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
          />

          <Input
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate}
          />
        </div>

        <div>
          <label
            htmlFor="reason"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Reason
          </label>

          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={4}
            placeholder="Enter the reason for your leave request"
            className={[
              'w-full rounded-xl border px-4 py-3 outline-none transition',
              errors.reason
                ? 'border-red-300 bg-red-50 focus:border-red-400'
                : 'border-slate-300 bg-white focus:border-slate-400',
            ].join(' ')}
          />

          {errors.reason ? (
            <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
          ) : null}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </PageSection>
  )
}