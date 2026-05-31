import { useEffect, useState } from 'react'
import Input from '../../shared/ui/Input'
import Button from '../../shared/ui/Button'
import PageSection from '../../shared/ui/PageSection'

const INITIAL_FORM = {
  name: '',
  description: '',
}

export default function DepartmentForm({
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
      description: initialValues?.description || '',
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
      setErrorMessage('Department name is required.')
      return
    }

    setErrorMessage('')

    const wasSuccessful = await onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || null,
    })

    if (wasSuccessful && mode === 'create') {
      setFormData(INITIAL_FORM)
    }
  }

  return (
    <PageSection
      title={mode === 'create' ? 'Create Department' : 'Update Department'}
      description={
        mode === 'create'
          ? 'Add a new department to the organization.'
          : 'Edit the selected department.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Department Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter department name"
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
            placeholder="Enter department description"
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
              ? 'Create Department'
              : 'Save Changes'}
          </Button>
        </div>
      </form>
    </PageSection>
  )
}