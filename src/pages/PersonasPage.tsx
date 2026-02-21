export function PersonasPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <section id="personas" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(0,0,0,0.38)]">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-[var(--color-heading)]">Stakeholder Personas & Simulation</h3>
          <p className="text-sm text-[var(--color-body)]">
            Engage AI-powered stakeholder personas for training and strategy testing. Use these simulations to
            practice engagement, refine messaging, and pressure-test decisions before real conversations. The
            scenarios below reflect how teams prepare for high-stakes engagements.
          </p>
          <ul className="list-disc list-inside text-sm text-[var(--color-body)] space-y-1">
            <li>Role-play donor briefings and stakeholder updates.</li>
            <li>Test value propositions with producers and exporters.</li>
            <li>Practice risk and impact communications.</li>
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
          <h3 className="text-xl font-semibold text-[var(--color-heading)] mb-4">Available Personas</h3>
          <div className="space-y-3">
            <a
              href="#ramiro"
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-persona-border)] bg-[var(--color-persona-bg)] px-3 py-1.5 text-left transition hover:border-[var(--color-icon-accent)] hover:bg-[var(--color-persona-hover)]"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-card-gradient-top)] flex items-center justify-center text-[var(--color-heading)] text-xs font-semibold">RA</div>
              <div className="text-sm text-[var(--color-body)]">Ramiro – The Bolivian Rancher</div>
            </a>
            <a
              href="#jannatul"
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-persona-border)] bg-[var(--color-persona-bg)] px-3 py-1.5 text-left transition hover:border-[var(--color-icon-accent)] hover:bg-[var(--color-persona-hover)]"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-card-gradient-top)] flex items-center justify-center text-[var(--color-heading)] text-xs font-semibold">JU</div>
              <div className="text-sm text-[var(--color-body)]">Jannatul – Bangladeshi University Student</div>
            </a>
            <a
              href="#niar-tun"
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-persona-border)] bg-[var(--color-persona-bg)] px-3 py-1.5 text-left transition hover:border-[var(--color-icon-accent)] hover:bg-[var(--color-persona-hover)]"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-card-gradient-top)] flex items-center justify-center text-[var(--color-heading)] text-xs font-semibold">NT</div>
              <div className="text-sm text-[var(--color-body)]">Niar Tun – Agribusiness Exporter from Myanmar</div>
            </a>
            <a
              href="#sarah-whitmore"
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-persona-border)] bg-[var(--color-persona-bg)] px-3 py-1.5 text-left transition hover:border-[var(--color-icon-accent)] hover:bg-[var(--color-persona-hover)]"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-card-gradient-top)] flex items-center justify-center text-[var(--color-heading)] text-xs font-semibold">SW</div>
              <div className="text-sm text-[var(--color-body)]">Sarah Whitmore – Senior Programme Manager at FCDO</div>
            </a>
          </div>
        </div>

        <section id="ramiro" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[140px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Ramiro – The Bolivian Rancher</h3>
            <a
              href="#ramiro"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Ramiro
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">Use for:</span> Practice stakeholder conversations focused on rural production, value chains, and sustainability incentives.</div>
            <div className="space-y-1">
              <span className="font-medium text-[var(--color-heading)] block">Typical scenarios:</span>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>Value proposition messaging for producers</li>
                <li>Climate-smart agriculture adoption objections</li>
                <li>Long-term partnership agreements</li>
              </ul>
            </div>
            <div><span className="font-medium text-[var(--color-heading)]">Outputs:</span> Practice questions, objection responses, partnership talking points, engagement strategy notes.</div>
          </div>
        </section>

        <section id="jannatul" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[140px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Jannatul – Bangladeshi University Student</h3>
            <a
              href="#jannatul"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Jannatul
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">Use for:</span> Practice engaging young professionals on employment, skills development, and social impact.</div>
            <div className="space-y-1">
              <span className="font-medium text-[var(--color-heading)] block">Typical scenarios:</span>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>Career pathway and opportunity positioning</li>
                <li>Addressing skills gaps and training needs</li>
                <li>Youth engagement in development initiatives</li>
              </ul>
            </div>
            <div><span className="font-medium text-[var(--color-heading)]">Outputs:</span> Youth engagement scripts, career messaging, training recommendations, program design feedback.</div>
          </div>
        </section>

        <section id="niar-tun" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[140px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Niar Tun – Agribusiness Exporter from Myanmar</h3>
            <a
              href="#niar-tun"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Niar Tun
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">Use for:</span> Role-play export market dynamics, compliance challenges, and commercial partnership discussions.</div>
            <div className="space-y-1">
              <span className="font-medium text-[var(--color-heading)] block">Typical scenarios:</span>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>Trade compliance and regulatory requirements</li>
                <li>Market access and international buyer relations</li>
                <li>Quality standards and certification barriers</li>
              </ul>
            </div>
            <div><span className="font-medium text-[var(--color-heading)]">Outputs:</span> Trade facilitation strategies, compliance checklists, market access talking points, partnership frameworks.</div>
          </div>
        </section>

        <section id="sarah-whitmore" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[140px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Sarah Whitmore – Senior Programme Manager at FCDO</h3>
            <a
              href="#sarah-whitmore"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Sarah Whitmore
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">Use for:</span> Practice donor engagement, results communication, and strategic program alignment with bilateral priorities.</div>
            <div className="space-y-1">
              <span className="font-medium text-[var(--color-heading)] block">Typical scenarios:</span>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>Results reporting and evidence-based storytelling</li>
                <li>Strategic alignment with donor priorities</li>
                <li>Risk management and adaptive programming</li>
              </ul>
            </div>
            <div><span className="font-medium text-[var(--color-heading)]">Outputs:</span> Donor briefing scripts, results narratives, strategic alignment documents, risk mitigation strategies.</div>
          </div>
        </section>
      </div>
    </section>
  );
}
