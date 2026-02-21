export function AssistantsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <section id="assistants" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(0,0,0,0.38)]">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-[var(--color-heading)]">On-the-Job AI Assistants</h3>
          <p className="text-sm text-[var(--color-body)]">
            AI-powered task companions embedded into real workflows. These assistants help teams move faster on
            budgeting, operations, and proposal development without leaving existing processes. The examples below
            mirror typical day-to-day usage.
          </p>
          <ul className="list-disc list-inside text-sm text-[var(--color-body)] space-y-1">
            <li>Budget drafts, reconciliations, and compliance checks.</li>
            <li>SOP and process updates to improve internal coordination.</li>
            <li>Proposal drafting with clear alignment to RFP criteria.</li>
          </ul>
          <button
            type="button"
            className="rounded-full bg-gradient-to-r from-[var(--color-cta-gradient-top)] to-[var(--color-cta-gradient-bottom)] px-6 py-3.5 text-sm font-semibold text-[var(--color-cta-text)] shadow-[var(--shadow-cta)] transition hover:from-[var(--color-cta-hover-top)] hover:to-[var(--color-cta-hover-bottom)]"
          >
            Request a Live Demo from Our Team
          </button>
        </div>
      </section>

      <div className="mt-16 space-y-8">
        <section id="financial-management" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Financial Management Help</h3>
            <a
              href="#financial-management"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Financial Management Help
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it helps with:</span> Draft budgets, reconcile reports, and flag compliance gaps.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Budget templates, transaction data, financial policies, compliance requirements.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Budget drafts, reconciliation summaries, compliance checklists, risk flags.</div>
          </div>
        </section>

        <section id="operations-systems" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Operations Systems Support</h3>
            <a
              href="#operations-systems"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Operations Systems Support
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it helps with:</span> Improve SOPs, process maps, internal workflows, and coordination systems.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Current SOPs, workflow diagrams, staff feedback, operational challenges.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Revised SOPs, process improvements, coordination guides, implementation plans.</div>
          </div>
        </section>

        <section id="business-development" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Business Development Assistant</h3>
            <a
              href="#business-development"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Business Development Assistant
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it helps with:</span> Draft proposal sections, check RFP alignment, and analyze partner fit.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> RFP documents, organizational capabilities, previous proposals, partner profiles.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Proposal drafts, RFP compliance analysis, partner assessment, competitive positioning.</div>
          </div>
        </section>

        <section id="marketing-comms" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Marketing & Communications Assistant</h3>
            <a
              href="#marketing-comms"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Marketing & Communications Assistant
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it helps with:</span> Generate donor updates, messaging drafts, and strategic communications.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Program results, impact data, donor briefs, communication objectives.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Donor updates, messaging frameworks, communications drafts, impact narratives.</div>
          </div>
        </section>
      </div>
    </section>
  );
}
