import { useState } from 'react'
import Button from '../../shared/ui/Button'

export default function ManagerRejectUpdateRequestForm({
  requestId,
  onApprove,
  onReject,
  isProcessing,
}) {
  const [reason, setReason] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  function validateReject() {
    if (!reason.trim()) {
      setErrorMessage('Reject reason is required.')
      return false
    }

    if (reason.trim().length > 255) {
      setErrorMessage('Reject reason max length is 255.')
      return false
    }

    setErrorMessage('')
    return true
  }

  async function handleApprove() {
    setErrorMessage('')
    await onApprove(requestId)
  }

  async function handleReject() {
    if (!validateReject()) {
      return
    }

    await onReject(requestId, {
      reason: reason.trim(),
    })
  }

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <label
        htmlFor={`reject-reason-${requestId}`}
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        Reject Reason
      </label>

      <textarea
        id={`reject-reason-${requestId}`}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        rows={3}
        placeholder="Enter rejection reason"
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