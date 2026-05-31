import { ROUTES } from './routes'

export const NAVIGATION_BY_ROLE = {
  EMPLOYEE: [
    { label: 'Dashboard', to: ROUTES.EMPLOYEE_DASHBOARD },
    { label: 'My Profile', to: ROUTES.EMPLOYEE_PROFILE },
    { label: 'Leave Requests', to: ROUTES.EMPLOYEE_LEAVE_REQUESTS },
    { label: 'Update Requests', to: ROUTES.EMPLOYEE_UPDATE_REQUESTS },
    { label: 'Attendance', to: ROUTES.EMPLOYEE_ATTENDANCE },
    { label: 'Assignments', to: ROUTES.EMPLOYEE_ASSIGNMENTS },
  ],
  MANAGER: [
    { label: 'Dashboard', to: ROUTES.MANAGER_DASHBOARD },
    { label: 'My Profile', to: ROUTES.MANAGER_PROFILE },
    { label: 'Department Employees', to: ROUTES.MANAGER_EMPLOYEES },
    { label: 'Leave Approvals', to: ROUTES.MANAGER_LEAVE_APPROVALS },
    { label: 'Update Approvals', to: ROUTES.MANAGER_UPDATE_APPROVALS },
    { label: 'Attendance', to: ROUTES.MANAGER_ATTENDANCE },
    { label: 'Assignments', to: ROUTES.MANAGER_ASSIGNMENTS },
  ],
  ADMIN: [
    { label: 'Dashboard', to: ROUTES.ADMIN_DASHBOARD },
    { label: 'Organization Structure', to: ROUTES.ADMIN_ORGANIZATION_STRUCTURE },
    { label: 'Employees', to: ROUTES.ADMIN_EMPLOYEES },
    { label: 'Departments', to: ROUTES.ADMIN_DEPARTMENTS },
    { label: 'Positions', to: ROUTES.ADMIN_POSITIONS },
    { label: 'Audit Logs', to: ROUTES.ADMIN_AUDIT_LOGS },
  ],
}