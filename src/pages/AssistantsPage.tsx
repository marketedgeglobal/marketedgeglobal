export function AssistantsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <section id="assistants" className="scroll-mt-28 rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8">
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
    </section>
  );
}
