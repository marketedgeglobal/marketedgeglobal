export function PersonasPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <section id="personas" className="scroll-mt-28 rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(0,0,0,0.38)]">
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
    </section>
  );
}
