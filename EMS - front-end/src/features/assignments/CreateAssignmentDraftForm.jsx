import { useState, useEffect } from 'react'
import Input from '../../shared/ui/Input'
import Button from '../../shared/ui/Button'
import PageSection from '../../shared/ui/PageSection'
import Select from '../../shared/ui/Select'
import { getManagerDepartmentEmployees } from './assignmentEmployeeOptionsService'

const INITIAL_FORM = {
  title: '',
  description: '',
  employeeId: '',
  dueAt: '',
  managerComment: '',
}

export default function CreateAssignmentDraftForm({ onSubmitDraft, onSubmitDirect, isSubmitting }) {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [isDirect, setIsDirect] = useState(false)
  const [employees, setEmployees] = useState([])
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isDirect) return

    let isMounted = true
    setIsLoadingEmployees(true)

    getManagerDepartmentEmployees()
      .then((data) => {
        if (isMounted) setEmployees(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (isMounted) setErrorMessage('Failed to load employees.')
      })
      .finally(() => {
        if (isMounted) setIsLoadingEmployees(false)
      })

    return () => { isMounted = false }
  }, [isDirect])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMessage('Title and description are required.')
      return
    }

    if (isDirect) {
      if (!formData.employeeId) {
        setErrorMessage('Employee is required.')
        return
      }
      if (!formData.dueAt) {
        setErrorMessage('Due date is required.')
        return
      }
    }

    setErrorMessage('')

    let wasSuccessful

    if (isDirect) {
      wasSuccessful = await onSubmitDirect({
        title: formData.title.trim(),
        description: formData.description.trim(),
        employeeId: Number(formData.employeeId),
        dueAt: formData.dueAt,
        managerComment: formData.managerComment.trim() || null,
      })
    } else {
      wasSuccessful = await onSubmitDraft({
        title: formData.title.trim(),
        description: formData.description.trim(),
      })
    }

    if (wasSuccessful) {
      setFormData(INITIAL_FORM)
    }
  }

  const employeeOptions = employees.map((e) => ({
    value: String(e.id),
    label: `${e.firstName} ${e.lastName} — ${e.positionName || 'Employee'}`,
  }))

  return (
    <PageSection
      title="Create Assignment"
      description="Save as a draft to assign later, or assign directly to an employee right away."
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

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isDirect}
            onChange={(e) => {
              setIsDirect(e.target.checked)
              setErrorMessage('')
            }}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span className="text-sm font-medium text-slate-700">
            Assign directly to employee
          </span>
        </label>

        {isDirect ? (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <Select
              label="Employee"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              options={employeeOptions}
              placeholder={isLoadingEmployees ? 'Loading employees...' : 'Select employee'}
            />

            <Input
              label="Due At"
              name="dueAt"
              type="datetime-local"
              value={formData.dueAt}
              onChange={handleChange}
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Manager Comment
              </label>
              <textarea
                name="managerComment"
                value={formData.managerComment}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                placeholder="Optional comment"
              />
            </div>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || (isDirect && isLoadingEmployees)}>
            {isSubmitting
              ? 'Processing...'
              : isDirect
              ? 'Create & Assign'
              : 'Save as Draft'}
          </Button>
        </div>
      </form>
    </PageSection>
  )
}