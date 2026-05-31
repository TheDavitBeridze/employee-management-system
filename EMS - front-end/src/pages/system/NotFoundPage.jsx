import { Link } from 'react-router-dom'
import PageContainer from '../../shared/ui/PageContainer'
import { ROUTES } from '../../shared/constants/routes'

export default function NotFoundPage() {
  return (
    <PageContainer
      title="Page Not Found"
      description="The page you are looking for does not exist."
    >
      <Link
        to={ROUTES.LOGIN}
        className="inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Go to Login
      </Link>
    </PageContainer>
  )
}