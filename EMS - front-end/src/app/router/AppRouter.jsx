import { Route, Routes } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import LoginPage from '../../pages/auth/LoginPage'
import EmployeeDashboardPage from '../../pages/employee/EmployeeDashboardPage'
import ManagerDashboardPage from '../../pages/manager/ManagerDashboardPage'
import AdminDashboardPage from '../../pages/admin/AdminDashboardPage'
import NotFoundPage from '../../pages/system/NotFoundPage'
import { ROUTES } from '../../shared/constants/routes'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import PlaceholderPage from '../../shared/ui/PlaceholderPage'
import EmployeeLeaveRequestsPage from '../../pages/employee/EmployeeLeaveRequestsPage'
import ManagerLeaveApprovalsPage from '../../pages/manager/ManagerLeaveApprovalsPage'
import EmployeeUpdateRequestsPage from '../../pages/employee/EmployeeUpdateRequestsPage'
import ManagerUpdateApprovalsPage from '../../pages/manager/ManagerUpdateApprovalsPage'
import DepartmentEmployeesPage from '../../pages/manager/DepartmentEmployeesPage'
import EmployeeAttendancePage from '../../pages/employee/EmployeeAttendancePage'
import DepartmentAttendancePage from '../../pages/manager/DepartmentAttendancePage'
import EmployeeAssignmentsPage from '../../pages/employee/EmployeeAssignmentsPage'
import AssignmentsPage from '../../pages/manager/AssignmentsPage'
import EmployeeProfilePage from '../../pages/employee/EmployeeProfilePage'
import ManagerProfilePage from '../../pages/manager/ManagerProfilePage'
import AdminEmployeesPage from '../../pages/admin/AdminEmployeesPage'
import AdminDepartmentsPage from '../../pages/admin/AdminDepartmentsPage'
import AdminPositionsPage from '../../pages/admin/AdminPositionsPage'
import OrganizationStructurePage from '../../pages/admin/OrganizationStructurePage'
import AdminAuditLogsPage from '../../pages/admin/AdminAuditLogsPage'



export default function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LoginPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route
        path={ROUTES.EMPLOYEE_DASHBOARD}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['EMPLOYEE']}>
              <AppLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeDashboardPage />} />

        <Route path="profile" element={<EmployeeProfilePage />} />

        <Route path="leave-requests" element={<EmployeeLeaveRequestsPage />} />

        <Route path="update-requests" element={<EmployeeUpdateRequestsPage />} />

        <Route path="attendance" element={<EmployeeAttendancePage />} />

        <Route path="assignments" element={<EmployeeAssignmentsPage />} />

      </Route>

      <Route
        path={ROUTES.MANAGER_DASHBOARD}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['MANAGER']}>
              <AppLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboardPage />} />

        <Route path="profile" element={<ManagerProfilePage />} />

        <Route path="employees" element={<DepartmentEmployeesPage />} />

        <Route path="leave-approvals" element={<ManagerLeaveApprovalsPage />} />

        <Route path="update-approvals" element={<ManagerUpdateApprovalsPage />} />
        
        <Route path="attendance" element={<DepartmentAttendancePage />} />

        <Route path="assignments" element={<AssignmentsPage />} />

      </Route>

      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['ADMIN']}>
              <AppLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
          
        <Route
          path="organization-structure"
          element={<OrganizationStructurePage />}
        />

        <Route path="employees" element={<AdminEmployeesPage />} />

        <Route path="departments" element={<AdminDepartmentsPage />} />

        <Route path="positions" element={<AdminPositionsPage />} />

        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}