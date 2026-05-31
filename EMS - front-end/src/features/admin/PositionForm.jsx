import { useEffect, useState } from 'react'
import Input from '../../shared/ui/Input'
import Button from '../../shared/ui/Button'
import PageSection from '../../shared/ui/PageSection'

const INITIAL_FORM = {
  name: '',
  baseSalary: '',
}

export default function PositionForm({
  mode = 'create',
  initialValues = INITIAL_FORM,
  onSubmit,
  isSubmitting,
  onCancel,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setFormData({
      name: initialValues?.name || '',
      baseSalary:
        initialValues?.baseSalary !== undefined &&
        initialValues?.baseSalary !== null
          ? String(initialValues.baseSalary)
          : '',
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

    if (!formData.name.trim()) {
      setErrorMessage('Position name is required.')
      return
    }

    if (!formData.baseSalary.trim()) {
      setErrorMessage('Base salary is required.')
      return
    }

    const parsedSalary = Number(formData.baseSalary)

    if (Number.isNaN(parsedSalary) || parsedSalary < 0) {
      setErrorMessage('Base salary must be a valid non-negative number.')
      return
    }

    setErrorMessage('')

    const wasSuccessful = await onSubmit({
      name: formData.name.trim(),
      baseSalary: parsedSalary,
    })

    if (wasSuccessful && mode === 'create') {
      setFormData(INITIAL_FORM)
    }
  }

  return (
    <PageSection
      title={mode === 'create' ? 'Create Position' : 'Update Position'}
      description={
        mode === 'create'
          ? 'Add a new position to the organization.'
          : 'Edit the selected position.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Position Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter position name"
        />

        <Input
          label="Base Salary"
          name="baseSalary"
          type="number"
          value={formData.baseSalary}
          onChange={handleChange}
          placeholder="Enter base salary"
        />

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
              ? 'Create Position'
              : 'Save Changes'}
          </Button>
        </div>
      </form>
    </PageSection>
  )
}