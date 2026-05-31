import { useState } from 'react'
import Input from '../../shared/ui/Input'
import Button from '../../shared/ui/Button'
import PageSection from '../../shared/ui/PageSection'

const INITIAL_FORM = {
  title: '',
  description: '',
}

export default function CreateAssignmentDraftForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errorMessage, setErrorMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMessage('Title and description are required.')
      return
    }

    setErrorMessage('')

    const wasSuccessful = await onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
    })

    if (wasSuccessful) {
      setFormData(INITIAL_FORM)
    }
  }

  return (
    <PageSection
      title="Create Assignment Draft"
      description="Create a draft assignment before assigning it to an employee."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter assignment title"
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
            placeholder="Enter assignment description"
          />
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Draft'}
          </Button>
        </div>
      </form>
    </PageSection>
  )
}