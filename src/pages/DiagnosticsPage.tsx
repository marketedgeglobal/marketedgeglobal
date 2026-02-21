export function DiagnosticsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <section id="diagnostics" className="scroll-mt-28 rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8">
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
