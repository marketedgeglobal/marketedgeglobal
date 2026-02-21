export function AnalyticsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <section id="analytics" className="scroll-mt-28 rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-[var(--color-heading)]">Advanced Analytics</h3>
          <p className="text-sm text-[var(--color-body)]">
            Turn documents and live data into structured insights and visual dashboards. Use these tools to compare
            options, surface priorities, and keep reporting aligned across delivery and portfolio work. The outputs
            below reflect what teams request most often.
          </p>
          <ul className="list-disc list-inside text-sm text-[var(--color-body)] space-y-1">
            <li>Weighted partner and sector rankings for clear comparisons.</li>
            <li>Report summaries that highlight findings, risks, and recommendations.</li>
            <li>RFP requirement extraction and compliance checks.</li>
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
