'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [name, setName] = useState('there')
  const [plan, setPlan] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('lumio_user')
    if (saved) {
      const u = JSON.parse(saved)
      setName(u.name || 'there')
    }
    loadPlan()
  }, [])

  async function loadPlan() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/login'
      return
    }
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) setPlan(data)
    if (error) console.log('Load plan error:', error)
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const score = plan?.score || null
  const goals = Array.isArray(plan?.goals) ? plan.goals : []
  const nearestGoal = goals[0] || null
  const debt = plan?.debt || null

  return (
    <div className="dash-wrap">
      <nav>
        <a className="logo" href="/">Lumio</a>
        <div className="nav-right">
          <a href="/profile" className="nav-link">Profile</a>
          <button className="nav-cta">Upgrade</button>
        </div>
      </nav>

      <div className="dash-main">

        <div className="dash-greeting">
          <p className="dash-date">{today}</p>
          <h1 className="dash-title">Good morning, <em>{name}.</em></h1>
          {score && <p className="dash-insight">Your financial health score is <strong>{score}/10</strong>. Keep building toward your goals.</p>}
        </div>

        <div className="dash-nw">
          <div className="dash-nw-top">
            <div>
              <div className="dash-nw-label">Net worth</div>
              <div className="dash-nw-value" style={{ fontSize: '1.4rem', opacity: 0.4 }}>Available with bank connection</div>
            </div>
          </div>
          <div className="dash-chart-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '140px' }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.25 }}>Connect your bank to track net worth over time</p>
          </div>
        </div>

        <p className="dash-cards-label">Your snapshot</p>
        <div className="dash-cards">
          <a href="/plan" className="dash-card">
            <div className="dash-card-label">Health score</div>
            <span className="dash-card-tag good">Your rating</span>
            <div className="dash-card-value">{score ? `${score}/10` : '—'}</div>
            <div className="dash-card-sub">Based on your full financial picture</div>
            <div className="dash-card-arrow">View plan →</div>
          </a>
          <a href="/plan" className="dash-card">
            <div className="dash-card-label">Nearest goal</div>
            <span className="dash-card-tag good">Active</span>
            <div className="dash-card-value">{nearestGoal ? nearestGoal.name : '—'}</div>
            <div className="dash-card-sub">{nearestGoal ? `${nearestGoal.monthly} · ${nearestGoal.timeline}` : 'Set your goals'}</div>
            <div className="dash-card-arrow">View goals →</div>
          </a>
          <a href="/plan" className="dash-card">
            <div className="dash-card-label">Debt status</div>
            <span className={`dash-card-tag ${debt?.hasDebt ? 'warn' : 'good'}`}>{debt?.hasDebt ? 'In progress' : 'Debt free'}</span>
            <div className="dash-card-value">{debt?.hasDebt ? debt.timeline : 'No debt'}</div>
            <div className="dash-card-sub">{debt?.hasDebt ? debt.monthly : 'Keep it up'}</div>
            <div className="dash-card-arrow">View strategy →</div>
          </a>
          <a href="/plan" className="dash-card">
            <div className="dash-card-label">Investment plan</div>
            <span className="dash-card-tag good">Active</span>
            <div className="dash-card-value">Step by step</div>
            <div className="dash-card-sub">Personalised to your age and income</div>
            <div className="dash-card-arrow">View roadmap →</div>
          </a>
        </div>

      </div>
    </div>
  )
}