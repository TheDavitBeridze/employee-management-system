const STATUS_STYLES = {
  PENDING: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-slate-200 text-slate-700',
  ACTIVE: 'bg-blue-100 text-blue-800',
  INACTIVE: 'bg-slate-200 text-slate-700',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  OPEN: 'bg-blue-100 text-blue-800',
  CLOSED: 'bg-slate-200 text-slate-700',
  DRAFT: 'bg-slate-100 text-slate-700',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  SUBMITTED: 'bg-amber-100 text-amber-800',
  OVERDUE: 'bg-orange-100 text-orange-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-slate-200 text-slate-700',
  CREATE: 'bg-blue-100 text-blue-800',
  UPDATE: 'bg-slate-100 text-slate-700',
  DELETE: 'bg-red-100 text-red-800',
  APPROVE: 'bg-emerald-100 text-emerald-800',
  REJECT: 'bg-red-100 text-red-800',
  CANCEL: 'bg-slate-200 text-slate-700',
  SUBMIT: 'bg-amber-100 text-amber-800',
  ASSIGN: 'bg-violet-100 text-violet-800',
  LOGIN: 'bg-blue-100 text-blue-800',
  LOGOUT: 'bg-slate-100 text-slate-700',
  CREATE: 'bg-blue-100 text-blue-800',
  UPDATE: 'bg-slate-100 text-slate-700',
  DELETE: 'bg-red-100 text-red-800',
  APPROVE: 'bg-emerald-100 text-emerald-800',
  REJECT: 'bg-red-100 text-red-800',
  CANCEL: 'bg-slate-200 text-slate-700',
  SUBMIT: 'bg-amber-100 text-amber-800',
  ASSIGN: 'bg-violet-100 text-violet-800',
  LOGIN: 'bg-blue-100 text-blue-800',
  LOGOUT: 'bg-slate-100 text-slate-700',
}

export default function StatusBadge({ status }) {
  const normalizedStatus = status?.toUpperCase?.() ?? 'UNKNOWN'

  const classes =
    STATUS_STYLES[normalizedStatus] ?? 'bg-slate-100 text-slate-700'

  return (
    <span
      className={[
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        classes,
      ].join(' ')}
    >
      {status ?? 'Unknown'}
    </span>
  )
}