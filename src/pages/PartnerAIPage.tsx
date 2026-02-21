export function PartnerAIPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="space-y-8">
        <div className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8">
          <h2 className="text-2xl font-semibold text-[var(--color-heading)]">PartnerAI™</h2>
          <h3 className="mt-1 text-lg font-semibold text-[var(--color-heading)]">Built for adoption, not deployment</h3>

          <p className="mt-2 text-[var(--color-body)]">
            PartnerAI™ works because MarketEdge stays involved and knows how social impact systems actually operate. Our team brings decades of experience advising donors, investors, large implementing partners, and on-the-ground NGOs and social enterprises.
          </p>

          <p className="mt-2 text-[var(--color-body)]">
            We have seen where delivery breaks down, where reporting distorts incentives, and where insight fails to translate into action. Most AI tools ignore these realities. MarketEdge treats PartnerAI™ as an organizational capability shaped by governance, incentives, and decision authority, not a software install.
          </p>

          <p className="mt-2 text-[var(--color-body)]">
            This experience allows us to embed intelligence where decisions occur, so AI supports action instead of adding parallel systems.
          </p>

          <div className="mt-5 rounded-lg bg-gradient-to-r from-[var(--color-cta-gradient-top)]/25 to-[var(--color-cta-gradient-bottom)]/15 p-4 border border-[var(--color-card-border)]">
            <h4 className="text-sm font-semibold text-[var(--color-heading)]">Impact Snapshot</h4>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Over 100k</div>
                <div className="text-xs text-[var(--color-muted)]">people reached</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">45%</div>
                <div className="text-xs text-[var(--color-muted)]">Avg. cost reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">120+</div>
                <div className="text-xs text-[var(--color-muted)]">organizations strengthened</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">8x</div>
                <div className="text-xs text-[var(--color-muted)]">Faster reporting</div>
              </div>
            </div>
          </div>

          <h3 className="mt-5 text-lg font-semibold text-[var(--color-heading)]">Shaped around how your organization actually works</h3>

          <p className="mt-2 text-[var(--color-body)]">
            MarketEdge starts with your reality, not a template. We analyze how delivery, portfolio management, and governance function today: who decides, what evidence carries weight, where coordination slows, and where reporting adds friction.
          </p>

          <p className="mt-2 text-[var(--color-body)]">
            We then tailor PartnerAI™ to those dynamics, aligning agents, dashboards, and outputs to roles, incentives, and decision cadence across teams and partners.
          </p>

          <h3 className="mt-5 text-lg font-semibold text-[var(--color-heading)]">Embedded into live work</h3>

          <p className="mt-2 text-[var(--color-body)]">
            PartnerAI™ integrates directly into day-to-day delivery. MarketEdge configures workflows that support proposal development, diagnostics, synthesis, learning, and oversight inside the processes teams already use.
          </p>

          <p className="mt-2 text-[var(--color-body)]">Our work typically includes:</p>

          <ul className="mt-2 list-disc list-inside text-[var(--color-body)] space-y-1">
            <li>Mapping delivery and governance workflows</li>
            <li>Clarifying decision rights and evidence needs</li>
            <li>Configuring role-specific agents and dashboards</li>
            <li>Embedding AI into live delivery and oversight</li>
            <li>Supporting adoption through targeted change management and iteration</li>
          </ul>

          <p className="mt-2 text-[var(--color-body)]">
            As priorities and partnerships evolve, MarketEdge adapts PartnerAI™ to keep it relevant and useful.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-6 text-[var(--color-body)]">
          <h3 className="text-lg font-semibold text-[var(--color-heading)]">MarketEdge Impact Over the Last Two Years</h3>
          <p className="mt-1 text-sm">Delivered using PartnerAI-enabled workflows, analytics, and learning tools</p>

          <ul className="mt-2 list-disc list-inside text-sm space-y-1">
            <li>30+ engagements delivered for 20+ partners across development, humanitarian, and conservation portfolios.</li>
            <li>Capacity strengthened for 130+ organizations,</li>
            <li>140+ analytic and decision-support products delivered, including market landscapes, political economy analyses, and organizational strategies and action plans.</li>
            <li>Over $10M in funding and investment catalyzed for partners and clients through AI-supported analysis and decision materials.</li>
          </ul>
        </div>

        <div className="flex">
          <button
            type="button"
            className="rounded-full bg-gradient-to-r from-[var(--color-cta-gradient-top)] to-[var(--color-cta-gradient-bottom)] px-6 py-3.5 text-sm font-semibold text-[var(--color-cta-text)] shadow-[var(--shadow-cta)] transition hover:from-[var(--color-cta-hover-top)] hover:to-[var(--color-cta-hover-bottom)]"
          >
            Request a Live Demo from Our Team
          </button>
        </div>
      </div>
    </section>
  );
}
