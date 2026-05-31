import { useState } from 'react'
import Button from '../../shared/ui/Button'

export default function ManagerLeaveDecisionForm({
  requestId,
  onApprove,
  onReject,
  isProcessing,
}) {
  const [managerComment, setManagerComment] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  function validate() {
    if (managerComment.length > 500) {
      setErrorMessage('Manager comment must be 500 characters or less.')
      return false
    }

    setErrorMessage('')
    return true
  }

  async function handleApprove() {
    if (!validate()) {
      return
    }

    await onApprove(requestId, {
      managerComment: managerComment.trim(),
    })
  }

  async function handleReject() {
    if (!validate()) {
      return
    }

    await onReject(requestId, {
      managerComment: managerComment.trim(),
    })
  }

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <label
        htmlFor={`manager-comment-${requestId}`}
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        Manager Comment
      </label>

      <textarea
        id={`manager-comment-${requestId}`}
        value={managerComment}
        onChange={(event) => setManagerComment(event.target.value)}
        rows={3}
        placeholder="Enter optional approval/rejection comment"
        className={[
          'w-full rounded-xl border px-4 py-3 outline-none transition',
          errorMessage
            ? 'border-red-300 bg-red-50 focus:border-red-400'
            : 'border-slate-300 bg-white focus:border-slate-400',
        ].join(' ')}
      />

      {errorMessage ? (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={handleApprove}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Approve'}
        </Button>

        <Button
          variant="danger"
          onClick={handleReject}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Reject'}
        </Button>
      </div>
    </div>
  )
}