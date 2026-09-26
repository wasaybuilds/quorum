/**
 * Page intro inside the content panel. The page name is already shown in the
 * panel header, so the title here is for screen readers and the visible row
 * carries the description and page actions.
 */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-h2 lg:sr-only">{title}</h1>
        {description && <p className="mt-1 text-body text-muted lg:mt-0">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function SectionHeading({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-h3">{children}</h2>
      {action}
    </div>
  );
}
