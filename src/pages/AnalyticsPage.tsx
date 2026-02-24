export function AnalyticsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <section id="analytics" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(0,0,0,0.38)]">
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
          <a
            href="mailto:info@marketedgeglobal.com?subject=PartnerAI Inquiry - Advanced Analytics&body=Hello MarketEdge team,%0D%0A%0D%0AI am interested in learning more about the Advanced Analytics tools in PartnerAI.%0D%0A%0D%0AThank you."
            className="inline-block rounded-full bg-gradient-to-r from-[var(--color-cta-gradient-top)] to-[var(--color-cta-gradient-bottom)] px-6 py-3.5 text-sm font-semibold text-[var(--color-cta-text)] shadow-[var(--shadow-cta)] transition hover:from-[var(--color-cta-hover-top)] hover:to-[var(--color-cta-hover-bottom)]"
          >
            Request a Live Demo from Our Team
          </a>
        </div>
      </section>

      <div className="mt-16 space-y-8">
        <section id="ranking-tool" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Ranking Tool</h3>
            <a
              href="https://marketedgeglobal.github.io/marketedgeglobal/explore-platform/ranking-tool/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Ranking Tool
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> Score and compare partners, sectors, or proposals using weighted criteria.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Candidate list, evaluation criteria, scoring rubric.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Ranked comparison matrix, scoring breakdown, recommendations.</div>
          </div>
        </section>

        <section id="publication-review" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Publication Review</h3>
            <a
              href={`${import.meta.env.BASE_URL}?assistant=publication-review#analytics`}
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Publication Review
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> Summarize long reports and extract key findings, themes, and recommendations.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Reports, research papers, policy documents (PDF, text).</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Executive summary, key findings list, thematic analysis.</div>
          </div>
        </section>

        <section id="market-intelligence" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Market Intelligence</h3>
            <a
              href="https://marketedgeglobal.github.io/marketintelligence/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Market Intelligence
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> Scan sectors and markets to identify trends, risks, and opportunity signals.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Sector, geography, timeframe, focus areas.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Trend analysis, competitive landscape, risk assessment.</div>
          </div>
        </section>

        <section id="rfp-intelligence" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">RFP Intelligence</h3>
            <a
              href="https://marketedgeglobal.github.io/rfpintelligence/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              RFP Intelligence
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> Extract requirements, deadlines, and compliance gaps from funding calls.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> RFP documents, funding calls, grant guidelines.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Requirements summary, compliance checklist, deadline calendar.</div>
          </div>
        </section>

        <section id="market-assessment" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Market Assessment (Sample: Mekong)</h3>
            <a
              href="https://marketedgeglobal.github.io/BASIN/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Market Assessment (Sample: Mekong)
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> Example structured market assessment for countries or sectors (replace with your own context).</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Regional data, socioeconomic indicators, sector performance metrics.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Market overview, opportunity map, strategic recommendations.</div>
          </div>
        </section>

        <section id="vzla-news" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">VZLA News</h3>
            <a
              href="https://marketedgeglobal.github.io/VZLAnews/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              VZLA News
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it does:</span> Track Venezuela market signals and news intelligence.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Country focus, sector priorities, news timeframe.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> News digest, market signal summaries, emerging risks.</div>
          </div>
        </section>
      </div>
    </section>
  );
}
