export function AnalyticsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <section id="analytics" className="scroll-mt-28 rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(0,0,0,0.38)]">
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

      <div className="mt-16 space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-[var(--color-heading)] mb-4">Available Tools</h3>
          <div className="flex flex-wrap gap-3">
            <a
              href="#ranking-tool"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out"
            >
              Ranking Tool
            </a>
            <a
              href="#publication-review"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out"
            >
              Publication Review
            </a>
            <a
              href="#market-intelligence"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out"
            >
              Market Intelligence
            </a>
            <a
              href="#rfp-intelligence"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out"
            >
              RFP Intelligence
            </a>
            <a
              href="#market-assessment"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out"
            >
              Market Assessment (Sample: Mekong)
            </a>
          </div>
        </div>

        <section id="ranking-tool" className="scroll-mt-28 rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8">
          <h3 className="text-lg font-semibold text-[var(--color-heading)]">Ranking Tool</h3>
          <div className="mt-3 space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> Score and compare partners, sectors, or proposals using weighted criteria.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Candidate list, evaluation criteria, scoring rubric.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Ranked comparison matrix, scoring breakdown, recommendations.</div>
          </div>
        </section>

        <section id="publication-review" className="scroll-mt-28 rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8">
          <h3 className="text-lg font-semibold text-[var(--color-heading)]">Publication Review</h3>
          <div className="mt-3 space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> Summarize long reports and extract key findings, themes, and recommendations.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Reports, research papers, policy documents (PDF, text).</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Executive summary, key findings list, thematic analysis.</div>
          </div>
        </section>

        <section id="market-intelligence" className="scroll-mt-28 rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8">
          <h3 className="text-lg font-semibold text-[var(--color-heading)]">Market Intelligence</h3>
          <div className="mt-3 space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> Scan sectors and markets to identify trends, risks, and opportunity signals.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Sector, geography, timeframe, focus areas.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Trend analysis, competitive landscape, risk assessment.</div>
          </div>
        </section>

        <section id="rfp-intelligence" className="scroll-mt-28 rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8">
          <h3 className="text-lg font-semibold text-[var(--color-heading)]">RFP Intelligence</h3>
          <div className="mt-3 space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> Extract requirements, deadlines, and compliance gaps from funding calls.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> RFP documents, funding calls, grant guidelines.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Requirements summary, compliance checklist, deadline calendar.</div>
          </div>
        </section>

        <section id="market-assessment" className="scroll-mt-28 rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8">
          <h3 className="text-lg font-semibold text-[var(--color-heading)]">Market Assessment (Sample: Mekong)</h3>
          <div className="mt-3 space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> Example structured market assessment for countries or sectors (replace with your own context).</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Regional data, socioeconomic indicators, sector performance metrics.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Market overview, opportunity map, strategic recommendations.</div>
          </div>
        </section>
      </div>
    </section>
  );
}
