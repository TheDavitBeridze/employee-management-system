import { useState } from 'react'
import Button from '../../shared/ui/Button'

export default function AssignmentSubmitForm({ assignmentId, onSubmit, isSubmitting }) {
  const [submissionComment, setSubmissionComment] = useState('')
  const [submissionLink, setSubmissionLink] = useState('')
  const [submissionFile, setSubmissionFile] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  function validate() {
    if (!submissionComment.trim()) {
      setErrorMessage('Submission comment is required.')
      return false
    }

    if (submissionComment.trim().length > 2000) {
      setErrorMessage('Submission comment max length is 2000.')
      return false
    }

    if (submissionLink.trim().length > 1000) {
      setErrorMessage('Submission link max length is 1000.')
      return false
    }

    setErrorMessage('')
    return true
  }

  async function handleSubmit() {
    if (!validate()) {
      return
    }

    const payload = {
      submissionComment: submissionComment.trim(),
      submissionLink: submissionLink.trim() || null,
      submissionFile,
    }

    const wasSuccessful = await onSubmit(assignmentId, payload)

    if (wasSuccessful) {
      setSubmissionComment('')
      setSubmissionLink('')
      setSubmissionFile(null)
    }
  }

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Submission Comment
      </label>
      <textarea
        value={submissionComment}
        onChange={(event) => setSubmissionComment(event.target.value)}
        rows={4}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
        placeholder="Describe your submission"
      />

      <label className="mb-1 mt-4 block text-sm font-medium text-slate-700">
        Submission Link
      </label>
      <input
        value={submissionLink}
        onChange={(event) => setSubmissionLink(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
        placeholder="Optional link"
      />

      <label className="mb-1 mt-4 block text-sm font-medium text-slate-700">
        Submission File
      </label>
      <input
        type="file"
        onChange={(event) => setSubmissionFile(event.target.files?.[0] ?? null)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
      />

      {submissionFile ? (
        <p className="mt-2 text-sm text-slate-600">
          Selected file: {submissionFile.name}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      ) : null}

      <div className="mt-4 flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
        </Button>
      </div>
    </div>
  )
}