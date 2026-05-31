import { useEffect, useState } from 'react'
import Button from '../../shared/ui/Button'
import Select from '../../shared/ui/Select'
import Input from '../../shared/ui/Input'
import { getManagerDepartmentEmployees } from './assignmentEmployeeOptionsService'

function formatDateTimeLocal(dateValue) {
  if (!dateValue) {
    return ''
  }

  const date = new Date(dateValue)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export default function AssignAssignmentForm({
  assignmentId,
  onAssign,
  isSubmitting,
  submitLabel = 'Assign',
  initialEmployeeId = '',
  initialDueAt = '',
  initialManagerComment = '',
  mode = 'assign',
}) {
  const [employees, setEmployees] = useState([])
  const [employeeId, setEmployeeId] = useState(initialEmployeeId ? String(initialEmployeeId) : '')
  const [dueAt, setDueAt] = useState(formatDateTimeLocal(initialDueAt))
  const [managerComment, setManagerComment] = useState(initialManagerComment)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadEmployees() {
      setIsLoadingEmployees(true)
      setErrorMessage('')

      try {
        const responseData = await getManagerDepartmentEmployees()

        if (isMounted) {
          setEmployees(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load employees for assignment.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoadingEmployees(false)
        }
      }
    }

    loadEmployees()

    return () => {
      isMounted = false
    }
  }, [])

  const employeeOptions = employees.map((employee) => ({
    value: String(employee.id),
    label: `${employee.firstName} ${employee.lastName} — ${employee.positionName || 'Employee'}`,
  }))

  async function handleSubmit(event) {
    event.preventDefault()

    if (!employeeId) {
      setErrorMessage('Employee is required.')
      return
    }

    if (!dueAt) {
      setErrorMessage('Due date is required.')
      return
    }

    setErrorMessage('')

    const payload =
      mode === 'reassign'
        ? {
            newEmployeeId: Number(employeeId),
            newDueAt: dueAt,
            managerComment: managerComment.trim() || null,
          }
        : {
            employeeId: Number(employeeId),
            dueAt,
            managerComment: managerComment.trim() || null,
          }

    const wasSuccessful = await onAssign(assignmentId, payload)

    if (wasSuccessful && mode === 'assign') {
      setEmployeeId('')
      setDueAt('')
      setManagerComment('')
    }
  }

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Employee"
          name="employeeId"
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
          options={employeeOptions}
          placeholder={isLoadingEmployees ? 'Loading employees...' : 'Select employee'}
        />

        <Input
          label="Due At"
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
            placeholder="Optional assignment comment"
          />
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || isLoadingEmployees}>
            {isSubmitting ? 'Processing...' : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  )
}