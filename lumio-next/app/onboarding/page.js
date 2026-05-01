'use client'

import { useState } from 'react'

export default function Onboarding() {
  const [method, setMethod] = useState('')
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    age: '',
    stage: '',
    goals: [],
    income: '',
    savings: '',
    debt: '',
    debtType: '',
  })

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const toggleGoal = (goal) => {
    setForm(f => ({
      ...f,
      goals: f.goals.includes(goal)
        ? f.goals.filter(g => g !== goal)
        : [...f.goals, goal]
    }))
  }

  const GOALS = [
    'Buy a home', 'Grow investments', 'Pay off debt',
    'Build emergency fund', 'Start a business', 'Early retirement',
    'Buy a car', 'Travel', 'Start a family', 'Save for education'
  ]

  const STAGES = [
    'Student', 'Early career', 'Mid career',
    'Senior career', 'Business owner', 'Pre-retirement'
  ]

  return (
    <div className="ob-wrap">
      <nav>
        <div className="logo">Lumio</div>
        <span className="ob-step-label">Step {step + 1} of 4</span>
      </nav>

      <div className="ob-progress">
        {[0,1,2,3].map(i => (
          <div key={i} className={`ob-seg ${i <= step ? 'on' : ''}`} />
        ))}
      </div>

      <div className="ob-body">

        {/* STEP 1 — PROFILE */}
        {step === 0 && (
          <div className="ob-step">
            <p className="ob-eyebrow">Step 1 of 4</p>
            <h1 className="ob-title">Tell us about<br /><em>you.</em></h1>
            <div className="ob-fields">
              <div className="ob-field">
                <label className="ob-lbl">First name</label>
                <input
                  className="ob-input"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                />
              </div>
              <div className="ob-row2">
                <div className="ob-field">
                  <label className="ob-lbl">Age</label>
                  <input
                    className="ob-input"
                    type="number"
                    placeholder="—"
                    value={form.age}
                    onChange={e => update('age', e.target.value)}
                  />
                </div>
                <div className="ob-field">
                  <label className="ob-lbl">Life stage</label>
                  <select
                    className="ob-select"
                    value={form.stage}
                    onChange={e => update('stage', e.target.value)}
                  >
                    <option value="">Select</option>
                    {STAGES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <button
              className="ob-next"
              disabled={!form.name || !form.age || !form.stage}
              onClick={() => setStep(1)}
            >
              Continue
            </button>
            <p className="ob-note">Your information is never stored or shared</p>
          </div>
        )}

        {/* STEP 2 — GOALS */}
        {step === 1 && (
          <div className="ob-step">
            <p className="ob-eyebrow">Step 2 of 4</p>
            <h1 className="ob-title">What are you<br /><em>working toward?</em></h1>
            <div className="ob-goals">
              {GOALS.map(g => (
                <button
                  key={g}
                  className={`ob-goal ${form.goals.includes(g) ? 'on' : ''}`}
                  onClick={() => toggleGoal(g)}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="ob-actions">
              <button
                className="ob-next"
                disabled={form.goals.length === 0}
                onClick={() => setStep(2)}
              >
                Continue
              </button>
              <button className="ob-back" onClick={() => setStep(0)}>← Back</button>
            </div>
          </div>
        )}

        {/* STEP 3 — SITUATION */}
        {step === 2 && (
          <div className="ob-step">
            <p className="ob-eyebrow">Step 3 of 4</p>
            <h1 className="ob-title">Your financial<br /><em>situation.</em></h1>
            <div className="ob-fields">
              <div className="ob-row2">
                <div className="ob-field">
                  <label className="ob-lbl">Monthly income ($)</label>
                  <input className="ob-input" type="number" placeholder="0" value={form.income} onChange={e => update('income', e.target.value)} />
                </div>
                <div className="ob-field">
                  <label className="ob-lbl">Current savings ($)</label>
                  <input className="ob-input" type="number" placeholder="0" value={form.savings} onChange={e => update('savings', e.target.value)} />
                </div>
              </div>
              <div className="ob-row2">
                <div className="ob-field">
                  <label className="ob-lbl">Total debt ($)</label>
                  <input className="ob-input" type="number" placeholder="0" value={form.debt} onChange={e => update('debt', e.target.value)} />
                </div>
                <div className="ob-field">
                  <label className="ob-lbl">Debt type</label>
                  <select className="ob-select" value={form.debtType} onChange={e => update('debtType', e.target.value)}>
                    <option value="">None</option>
                    <option>Student loans</option>
                    <option>Credit card</option>
                    <option>Car loan</option>
                    <option>Mortgage</option>
                    <option>Mixed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="ob-actions">
              <button className="ob-next" onClick={() => setStep(3)}>Continue</button>
              <button className="ob-back" onClick={() => setStep(1)}>← Back</button>
            </div>
          </div>
        )}

        {/* STEP 4 — CONNECT */}
        {step === 3 && (
          <div className="ob-step">
            <p className="ob-eyebrow">Step 4 of 4</p>
            <h1 className="ob-title">Connect your<br /><em>finances.</em></h1>

            <div className="ob-connect-opts">
              <button className={`ob-opt ${method === 'bank' ? 'on' : ''}`} onClick={() => setMethod('bank')}>
                <div>
                  <div className="ob-opt-name">Connect your bank</div>
                  <div className="ob-opt-desc">Automatic, accurate, read-only access to your transactions</div>
                </div>
                <span className="ob-opt-tag">Recommended</span>
              </button>
              <button className={`ob-opt ${method === 'manual' ? 'on' : ''}`} onClick={() => setMethod('manual')}>
                <div>
                  <div className="ob-opt-name">Enter manually</div>
                  <div className="ob-opt-desc">Type in your income and spending categories yourself</div>
                </div>
                <span className="ob-opt-tag">Manual</span>
              </button>
            </div>

            {method === 'manual' && (
              <div className="ob-fields" style={{ marginBottom: '1.6rem' }}>
                <div className="ob-row2">
                  <div className="ob-field">
                    <label className="ob-lbl">Housing ($/mo)</label>
                    <input className="ob-input" type="number" placeholder="0" value={form.housing || ''} onChange={e => update('housing', e.target.value)} />
                  </div>
                  <div className="ob-field">
                    <label className="ob-lbl">Food ($/mo)</label>
                    <input className="ob-input" type="number" placeholder="0" value={form.food || ''} onChange={e => update('food', e.target.value)} />
                  </div>
                </div>
                <div className="ob-row2">
                  <div className="ob-field">
                    <label className="ob-lbl">Transport ($/mo)</label>
                    <input className="ob-input" type="number" placeholder="0" value={form.transport || ''} onChange={e => update('transport', e.target.value)} />
                  </div>
                  <div className="ob-field">
                    <label className="ob-lbl">Entertainment ($/mo)</label>
                    <input className="ob-input" type="number" placeholder="0" value={form.entertainment || ''} onChange={e => update('entertainment', e.target.value)} />
                  </div>
                </div>
                <div className="ob-row2">
                  <div className="ob-field">
                    <label className="ob-lbl">Utilities ($/mo)</label>
                    <input className="ob-input" type="number" placeholder="0" value={form.utilities || ''} onChange={e => update('utilities', e.target.value)} />
                  </div>
                  <div className="ob-field">
                    <label className="ob-lbl">Other ($/mo)</label>
                    <input className="ob-input" type="number" placeholder="0" value={form.other || ''} onChange={e => update('other', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

    {method === 'bank' && (
      <div className="ob-fields" style={{ marginBottom: '1.6rem' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink)', opacity: 0.5, lineHeight: 1.7 }}>
          Bank connection via Plaid coming soon. For now please use manual entry.
        </p>
      </div>
    )}

    <div className="ob-actions">
      <button
        className="ob-next"
        disabled={!method}
        onClick={() => {
          localStorage.setItem('lumio_user', JSON.stringify(form))
          window.location.href = '/plan'
        }}
      >
        Generate my plan
      </button>
      <button className="ob-back" onClick={() => setStep(2)}>← Back</button>
    </div>
    <p className="ob-note">256-bit encryption · Read-only access · Disconnect anytime</p>
  </div>
)}

      </div>
    </div>
  )
}