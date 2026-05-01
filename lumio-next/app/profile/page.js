'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const STAGES = ['Student', 'Early career', 'Mid career', 'Senior career', 'Business owner', 'Pre-retirement']
const GOALS = ['Buy a home', 'Grow investments', 'Pay off debt', 'Build emergency fund', 'Start a business', 'Early retirement', 'Buy a car', 'Travel', 'Start a family', 'Save for education']

export default function Profile() {
  const [form, setForm] = useState({ name: '', age: '', stage: '', income: '', savings: '', debt: '', debtType: '', goals: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('lumio_user')
    if (stored) setForm(JSON.parse(stored))
    setLoading(false)
  }, [])

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleGoal = g => update('goals', form.goals.includes(g) ? form.goals.filter(x => x !== g) : [...form.goals, g])

  async function handleSave() {
    setSaving(true)
    localStorage.setItem('lumio_user', JSON.stringify(form))

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').upsert({
        id: user.id,
        name: form.name,
        age: parseInt(form.age),
        stage: form.stage,
        income: parseFloat(form.income),
        savings: parseFloat(form.savings),
        debt: parseFloat(form.debt),
        debt_type: form.debtType,
        goals: form.goals,
      })
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="plan-loading"><div className="plan-spinner"></div></div>

  return (
    <div className="auth-wrap">
      <nav>
        <a className="logo" href="/">Lumio</a>
        <div className="nav-right">
          <a href="/dashboard" className="nav-link">Dashboard</a>
        </div>
      </nav>

      <div className="auth-body" style={{ alignItems: 'flex-start', paddingTop: '3rem' }}>
        <div className="auth-card" style={{ maxWidth: '560px' }}>
          <p className="ob-eyebrow">Your profile</p>
          <h1 className="ob-title">Personal<br /><em>information.</em></h1>

          <div className="ob-fields">
            <div className="ob-field">
              <label className="ob-lbl">First name</label>
              <input className="ob-input" type="text" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div className="ob-row2">
              <div className="ob-field">
                <label className="ob-lbl">Age</label>
                <input className="ob-input" type="number" value={form.age} onChange={e => update('age', e.target.value)} />
              </div>
              <div className="ob-field">
                <label className="ob-lbl">Life stage</label>
                <select className="ob-select" value={form.stage} onChange={e => update('stage', e.target.value)}>
                  <option value="">Select</option>
                  {STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="ob-row2">
              <div className="ob-field">
                <label className="ob-lbl">Monthly income ($)</label>
                <input className="ob-input" type="number" value={form.income} onChange={e => update('income', e.target.value)} />
              </div>
              <div className="ob-field">
                <label className="ob-lbl">Savings ($)</label>
                <input className="ob-input" type="number" value={form.savings} onChange={e => update('savings', e.target.value)} />
              </div>
            </div>
            <div className="ob-row2">
              <div className="ob-field">
                <label className="ob-lbl">Total debt ($)</label>
                <input className="ob-input" type="number" value={form.debt} onChange={e => update('debt', e.target.value)} />
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
        async function handleDelete() {
            if (!confirm('Are you sure? This will permanently delete your account and all your data.')) return
            
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase.from('plans').delete().eq('user_id', user.id)
                await supabase.from('users').delete().eq('id', user.id)
                await supabase.auth.signOut()
            }
            window.location.href = '/'
            }
          <div className="ob-field" style={{ marginBottom: '1.6rem' }}>
            <label className="ob-lbl">Goals</label>
            <div className="ob-goals" style={{ marginTop: '0.6rem' }}>
              {GOALS.map(g => (
                <button key={g} className={`ob-goal ${form.goals.includes(g) ? 'on' : ''}`} onClick={() => toggleGoal(g)}>{g}</button>
              ))}
            </div>
          </div>

          <button className="ob-next" onClick={handleSave} disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save changes'}
          </button>

          <div style={{ marginTop: '1.4rem', paddingTop: '1.4rem', borderTop: '1px solid var(--rule)' }}>
            <p className="ob-eyebrow" style={{ marginBottom: '0.8rem' }}>Regenerate your plan</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink)', opacity: 0.45, lineHeight: 1.7, marginBottom: '1rem' }}>
              After updating your information, regenerate your plan to get fresh advice based on your new situation.
            </p>
            <a href="/plan?regen=true" className="p-btn" style={{ display: 'inline-block' }}>Regenerate plan</a>
            <div style={{ marginTop: '2rem', paddingTop: '1.4rem', borderTop: '1px solid var(--rule)' }}>
                <p className="ob-eyebrow" style={{ marginBottom: '0.8rem' }}>Danger zone</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--ink)', opacity: 0.45, lineHeight: 1.7, marginBottom: '1rem' }}>
                    Permanently delete your account and all associated data. This cannot be undone.
                </p>
                <button
                    className="p-btn"
                    style={{ borderColor: '#9b2335', color: '#9b2335' }}
                    onClick={handleDelete}
                >
                    Delete account
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}