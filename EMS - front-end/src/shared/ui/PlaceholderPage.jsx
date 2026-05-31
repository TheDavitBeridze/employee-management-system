import PageHeader from './PageHeader'
import EmptyState from './EmptyState'

export default function PlaceholderPage({ title, description }) {
  return (
    <div>
      <PageHeader title={title} description={description} />

      <EmptyState
        title="Page is ready"
        description="This page has been prepared and will be implemented in the next phase."
      />
    </div>
  )
}