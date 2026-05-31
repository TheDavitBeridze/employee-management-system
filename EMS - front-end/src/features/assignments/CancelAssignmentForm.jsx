import { useState } from 'react'
import Button from '../../shared/ui/Button'

export default function CancelAssignmentForm({
  assignmentId,
  onCancel,
  isSubmitting,
}) {
  const [managerComment, setManagerComment] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (managerComment.trim().length > 1000) {
      setErrorMessage('Manager comment max length is 1000.')
      return
    }

    setErrorMessage('')

    await onCancel(assignmentId, {
      managerComment: managerComment.trim() || null,
    })
  }

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Cancel Comment
          </label>
          <textarea
            value={managerComment}
            onChange={(event) => setManagerComment(event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
            placeholder="Optional reason for cancellation"
          />
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" variant="danger" disabled={isSubmitting}>
            {isSubmitting ? 'Cancelling...' : 'Confirm Cancel'}
          </Button>
        </div>
      </form>
    </div>
  )
}