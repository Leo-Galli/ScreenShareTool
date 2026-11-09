type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  children?: React.ReactNode
}

const PageHeader = ({ eyebrow, title, description, children }: PageHeaderProps) => {
  return (
    <header className="mb-14 max-w-3xl border-b border-[var(--rule)] pb-10">
      <p className="section-label">{eyebrow}</p>
      <h1
        className="font-display text-[var(--ink)]"
        style={{ fontSize: "clamp(2.5rem, 7vw, 4.25rem)", letterSpacing: "-0.05em", lineHeight: 0.98 }}
      >
        {title}
      </h1>
      <span className="mark-bar mt-5" aria-hidden="true" />
      <p className="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--muted)" }}>
        {description}
      </p>
      {children ? <div className="mt-8">{children}</div> : null}
    </header>
  )
}

export default PageHeader
