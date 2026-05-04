'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [name, setName] = useState('there')
  const [plan, setPlan] = useState(null)
  const [whatIf, setWhatIf] = useState('')
  const [whatIfResult, setWhatIfResult] = useState('')
  const [whatIfLoading, setWhatIfLoading] = useState(false)

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

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }
  
  async function analyseWhatIf() {
    if (!whatIf.trim() || whatIfLoading) return
    setWhatIfLoading(true)
    setWhatIfResult('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: `You are Lumio, a personal financial advisor. The user's financial plan: ${JSON.stringify(plan)}. 
            
  The user is asking: "${whatIf}"

  Respond in 2-3 sentences. Be specific with numbers. Tell them exactly how this purchase affects their goals and timeline. Be honest but not discouraging.`
          }]
        })
      })
      const data = await res.json()
      const reply = data.content.map(b => b.text || '').join('').trim()
      setWhatIfResult(reply)
    } catch {
      setWhatIfResult('Unable to analyse right now. Please try again.')
    } finally {
      setWhatIfLoading(false)
    }
  }

  

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
          <h1 className="dash-title">{getGreeting()}, <em>{name}.</em></h1>          
          {score && <p className="dash-insight">Your financial health score is <strong>{score}/10</strong>. Keep building toward your goals.</p>}
          <div className="dash-whatif">
            <p className="dash-cards-label">What if calculator</p>
            <div className="dash-whatif-card">
              <p className="dash-whatif-desc">Enter a hypothetical purchase and see how it affects your goals.</p>
              <div className="dash-whatif-input-row">
                <input
                  className="dash-whatif-input"
                  type="text"
                  placeholder="e.g. I want to buy a $1,200 laptop"
                  value={whatIf}
                  onChange={e => setWhatIf(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && analyseWhatIf()}
                />
                <button className="dash-whatif-btn" onClick={analyseWhatIf} disabled={!whatIf.trim() || whatIfLoading}>
                  {whatIfLoading ? '...' : 'Analyse'}
                </button>
              </div>
              {whatIfResult && (
                <p className="dash-whatif-result">{whatIfResult}</p>
              )}
            </div>
          </div>
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