export function DiagnosticsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <section id="diagnostics" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(0,0,0,0.38)]">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-[var(--color-heading)]">Rapid Diagnostics</h3>
          <p className="text-sm text-[var(--color-body)]">
            Run structured capacity and performance assessments. These diagnostics guide teams through evidence
            gathering and deliver clear improvement roadmaps. The outputs below reflect common assessment needs.
          </p>
          <ul className="list-disc list-inside text-sm text-[var(--color-body)] space-y-1">
            <li>Capacity scorecards with clear gap analysis.</li>
            <li>Prioritized recommendations tied to delivery constraints.</li>
            <li>Coaching prompts that guide next-step improvements.</li>
          </ul>
          <a
            href="mailto:info@marketedgeglobal.com?subject=PartnerAI Inquiry - Diagnostics&body=Hello MarketEdge team,%0D%0A%0D%0AI am interested in learning more about the Rapid Diagnostics in PartnerAI.%0D%0A%0D%0AThank you."
            className="inline-block rounded-full bg-gradient-to-r from-[var(--color-cta-gradient-top)] to-[var(--color-cta-gradient-bottom)] px-6 py-3.5 text-sm font-semibold text-[var(--color-cta-text)] shadow-[var(--shadow-cta)] transition hover:from-[var(--color-cta-hover-top)] hover:to-[var(--color-cta-hover-bottom)]"
          >
            Request a Live Demo from Our Team
          </a>
        </div>
      </section>

      <div className="mt-16 space-y-8">
        <section id="self-assessment-survey" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Organization Self-Assessment Survey</h3>
            <a
              href="#self-assessment-survey"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Organization Self-Assessment Survey
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> Structured capacity assessment with scoring and gap analysis.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Self-assessment responses across key organizational dimensions (operations, finance, governance, systems).</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Capacity scorecard, gap summary, prioritized improvement areas, actionable recommendations.</div>
          </div>
        </section>

        <section id="virtual-coach" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Organization Diagnostic Virtual Coach</h3>
            <a
              href="#virtual-coach"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Organization Diagnostic Virtual Coach
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> AI-guided diagnostic with recommendations and improvement roadmap.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Organization profile, current challenges, assessment data, strategic priorities.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Diagnostic findings, prioritized improvement roadmap, coaching prompts, implementation guidance.</div>
          </div>
        </section>
      </div>
    </section>
  );
}
