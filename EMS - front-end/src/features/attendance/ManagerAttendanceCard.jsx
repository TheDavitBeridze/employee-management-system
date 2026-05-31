import Card from '../../shared/ui/Card'
import StatusBadge from '../../shared/ui/StatusBadge'

function formatDate(dateValue) {
  if (!dateValue) {
    return '--'
  }

  return new Date(dateValue).toLocaleDateString()
}

function formatDateTime(dateValue) {
  if (!dateValue) {
    return '--'
  }

  return new Date(dateValue).toLocaleString()
}

function getAttendanceStatus(record) {
  return record.checkOutTime ? 'COMPLETED' : 'ACTIVE'
}

function renderField(label, value) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm text-slate-700">{value || '--'}</p>
    </div>
  )
}

export default function ManagerAttendanceCard({ record }) {
  const attendanceStatus = getAttendanceStatus(record)

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-base font-semibold text-slate-900">
            {record.employeeFirstName} {record.employeeLastName}
          </h3>
          <StatusBadge status={attendanceStatus} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {renderField('Work Date', formatDate(record.workDate))}
          {renderField('Department', record.departmentName)}
          {renderField('Check In', formatDateTime(record.checkInTime))}
          {renderField('Check Out', formatDateTime(record.checkOutTime))}
          {renderField('Created At', formatDateTime(record.createdAt))}
          {renderField('Employee ID', record.employeeId)}
        </div>
      </div>
    </Card>
  )
}