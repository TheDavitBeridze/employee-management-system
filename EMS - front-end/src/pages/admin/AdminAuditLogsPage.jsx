import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import Input from '../../shared/ui/Input'
import Select from '../../shared/ui/Select'
import AdminAuditLogCard from '../../features/admin/AdminAuditLogCard'
import { getAuditLogs } from '../../features/admin/adminAuditLogService'

export default function AdminAuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [entityFilter, setEntityFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadAuditLogs() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getAuditLogs()

        if (isMounted) {
          setAuditLogs(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load audit logs.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAuditLogs()

    return () => {
      isMounted = false
    }
  }, [])

  const actionOptions = useMemo(() => {
    const uniqueActions = [...new Set(auditLogs.map((log) => log.action).filter(Boolean))]

    return uniqueActions.map((action) => ({
      value: action,
      label: action,
    }))
  }, [auditLogs])

  const entityOptions = useMemo(() => {
    const uniqueEntities = [...new Set(auditLogs.map((log) => log.entityType).filter(Boolean))]

    return uniqueEntities.map((entityType) => ({
      value: entityType,
      label: entityType,
    }))
  }, [auditLogs])

  const filteredAuditLogs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return auditLogs.filter((log) => {
      const matchesSearch =
        !normalizedSearch ||
        String(log.id || '').toLowerCase().includes(normalizedSearch) ||
        String(log.actorUserId || '').toLowerCase().includes(normalizedSearch) ||
        String(log.actorEmail || '').toLowerCase().includes(normalizedSearch) ||
        String(log.action || '').toLowerCase().includes(normalizedSearch) ||
        String(log.entityType || '').toLowerCase().includes(normalizedSearch) ||
        String(log.entityId || '').toLowerCase().includes(normalizedSearch) ||
        String(log.details || '').toLowerCase().includes(normalizedSearch)

      const matchesAction = !actionFilter || log.action === actionFilter
      const matchesEntity = !entityFilter || log.entityType === entityFilter

      return matchesSearch && matchesAction && matchesEntity
    })
  }, [auditLogs, searchTerm, actionFilter, entityFilter])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Review operational history, entity changes, and system actions."
      />

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <PageSection
        title="Audit Log History"
        description="Search and filter audit events across the system."
      >
        <div className="mb-4 grid gap-4 md:grid-cols-3">
          <Input
            label="Search"
            name="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by actor, action, entity, details, or ID"
          />

          <Select
            label="Action"
            name="action"
            value={actionFilter}
            onChange={(event) => setActionFilter(event.target.value)}
            options={actionOptions}
            placeholder="All actions"
          />

          <Select
            label="Entity Type"
            name="entityType"
            value={entityFilter}
            onChange={(event) => setEntityFilter(event.target.value)}
            options={entityOptions}
            placeholder="All entity types"
          />
        </div>

        {isLoading ? <Loader text="Loading audit logs..." /> : null}

        {!isLoading && filteredAuditLogs.length === 0 ? (
          <EmptyState
            title="No audit logs found"
            description={
              searchTerm || actionFilter || entityFilter
                ? 'No audit logs matched your filters.'
                : 'There are no audit logs available yet.'
            }
          />
        ) : null}

        {!isLoading && filteredAuditLogs.length > 0 ? (
          <div className="space-y-4">
            {filteredAuditLogs.map((log) => (
              <AdminAuditLogCard key={log.id} log={log} />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}