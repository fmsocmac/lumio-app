export default function Home() {
  return (
    <>
      <nav>
        <div className="logo">Lumio</div>
        <div className="nav-right">
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="/signup" className="nav-cta">Get started</a>
        </div>
      </nav>

      <main className="hero">
        <p className="hero-label">Personal financial advisor</p>
        <h1>Finally understand<br /><em>your money.</em></h1>
        <p className="hero-sub">
          Lumio connects to your bank and delivers a personalised
          financial plan — budgeting, investing, debt, and a clear
          path to every goal.
        </p>
        <a href="/signup" className="cta">Get your free plan</a>
        <p className="hero-note">
          Free to start · Bank-level encryption · Read-only access
        </p>
      </main>

      <hr className="rule" />

      <section className="how" id="how">
        <div className="side-title">How it<br /><em>works.</em></div>
        <div className="step-list">
          {[
            { n: 'i.', title: 'Tell us about you', desc: 'Your name, age, and where you are in life. Lumio gets to know you before it touches your numbers.' },
            { n: 'ii.', title: 'Set your goals', desc: 'A home, a business, early retirement. Lumio works backward from where you want to go.' },
            { n: 'iii.', title: 'Share your situation', desc: 'Savings and debt. Two minutes of honest context that completely changes your plan.' },
            { n: 'iv.', title: 'Connect your bank', desc: 'Secure, read-only access. Lumio sees your real spending and builds around the truth.' },
          ].map((s) => (
            <div className="step" key={s.n}>
              <span className="step-n">{s.n}</span>
              <div>
                <div className="step-name">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule" />

      <section className="gets">
        <div className="gets-inner">
          <p className="sec-label">What you get</p>
          <h2 className="sec-title">Everything, in <em>one place.</em></h2>
          <div>
            {[
              ['Your financial plan', 'A health score, personal summary, and six detailed sections written for your situation.'],
              ['Net worth dashboard', 'Watch your wealth grow over time. Glanceable, but with the depth to go further.'],
              ['Budget analysis', 'Real spending from your bank — not estimates. Honest, automatic, and specific.'],
              ['Investment roadmap', 'A step-by-step plan built around your age, income, and risk tolerance.'],
              ['Debt strategy', 'The exact payoff order, amounts, and timeline. Know precisely when you\'re free.'],
              ['Goal tracking', 'Set milestones, see monthly targets, watch progress toward everything that matters.'],
              ['Ask anything', 'Follow-up questions answered based on your specific situation — not generic advice.'],
            ].map(([name, desc]) => (
              <div className="get-row" key={name}>
                <span className="get-name">{name}</span>
                <span className="get-desc">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="side-title">Plans we<br /><em>offer.</em></div>
        <div className="p-stack">
          <div className="p-tier">
            <div className="p-top">
              <span className="p-name">Free</span>
              <span className="p-price">$0</span>
            </div>
            <div className="p-items">
              {['One financial plan','Basic budget view','Goal setting','Manual entry'].map(i => (
                <span className="p-item" key={i}>{i}</span>
              ))}
            </div>
            <a href="/signup" className="p-btn">Get started</a>
          </div>
          <div className="p-tier premium">
            <div className="p-top">
              <span className="p-name">Premium</span>
              <span className="p-price">$12 / mo</span>
            </div>
            <div className="p-items">
              {['Unlimited plan updates','Full dashboard','Bank connection','All six plan tabs','Unlimited chat','Monthly refresh'].map(i => (
                <span className="p-item" key={i}>{i}</span>
              ))}
            </div>
            <a href="/signup" className="p-btn strong">Start free trial</a>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section className="closing">
        <h2>Your money,<br /><em>understood.</em></h2>
        <p>Join thousands of people who finally have a clear, honest picture of their finances — and a real plan to improve them.</p>
        <a href="/signup" className="cta">Get your free plan</a>
      </section>

      <footer>
        <div className="f-logo">Lumio</div>
        <div className="f-links">
          <a href="#">Privacy</a>
          <a href="#">Security</a>
          <a href="#">Terms</a>
        </div>
        <div className="f-copy">© 2026 Lumio</div>
      </footer>
    </>
  )
}