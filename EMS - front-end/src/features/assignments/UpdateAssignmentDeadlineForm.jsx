import { useState } from 'react'
import Input from '../../shared/ui/Input'
import Button from '../../shared/ui/Button'

export default function UpdateAssignmentDeadlineForm({
  assignmentId,
  onUpdateDeadline,
  isSubmitting,
}) {
  const [dueAt, setDueAt] = useState('')
  const [managerComment, setManagerComment] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!dueAt) {
      setErrorMessage('Due date is required.')
      return
    }

    setErrorMessage('')

    await onUpdateDeadline(assignmentId, {
      dueAt,
      managerComment: managerComment.trim() || null,
    })
  }

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New Deadline"
          name="dueAt"
          type="datetime-local"
          value={dueAt}
          onChange={(event) => setDueAt(event.target.value)}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Manager Comment
          </label>
          <textarea
            value={managerComment}
            onChange={(event) => setManagerComment(event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
            placeholder="Optional comment"
          />
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Deadline'}
          </Button>
        </div>
      </form>
    </div>
  )
}