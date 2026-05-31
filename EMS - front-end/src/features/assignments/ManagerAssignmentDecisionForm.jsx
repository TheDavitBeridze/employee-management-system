import { useState } from 'react'
import Button from '../../shared/ui/Button'

export default function ManagerAssignmentDecisionForm({
  assignmentId,
  onApprove,
  onReject,
  isProcessing,
}) {
  const [managerComment, setManagerComment] = useState('')

  async function handleApprove() {
    await onApprove(assignmentId, {
      managerComment: managerComment.trim() || null,
    })
  }

  async function handleReject() {
    await onReject(assignmentId, {
      managerComment: managerComment.trim() || null,
    })
  }

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
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

      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={handleApprove} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Approve'}
        </Button>

        <Button variant="danger" onClick={handleReject} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Reject'}
        </Button>
      </div>
    </div>
  )
}