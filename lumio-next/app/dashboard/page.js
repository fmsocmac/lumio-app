'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

const PERIODS = {
  '3m': {
    values: [44200,45100,45800,46200,46900,47400,47800,48240],
    labels: ['Feb','','','Mar','','','Apr','']
  },
  '6m': {
    values: [41400,42100,42800,43200,44200,45100,45800,46200,46900,47400,47800,48240],
    labels: ['Nov','','Jan','','Feb','','Mar','','Apr','','','']
  },
  '1y': {
    values: [36000,36800,37500,38200,38900,39400,40100,41000,42100,43200,45100,48240],
    labels: ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr']
  },
  'all': {
    values: [28000,29500,31000,32400,33800,35200,36000,37500,39400,41000,43200,48240],
    labels: ['2023','','','','','','2024','','','','','Now']
  }
}

export default function Dashboard() {
  const [period, setPeriod] = useState('6m')
  const [name, setName] = useState('there')
  const [plan, setPlan] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('lumio_user')
    if (saved) {
      const u = JSON.parse(saved)
      setName(u.name || 'there')
    }
    loadPlan()
  }, [])

  useEffect(() => {
    if (canvasRef.current) drawChart(PERIODS[period])
  }, [period])

  useEffect(() => {
    if (canvasRef.current && plan) drawChart(PERIODS[period])
  }, [plan])

  async function loadPlan() {
    console.log('loadPlan called')
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Auth user:', user?.id)
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
      .single()

    if (data) {
      console.log('Plan from DB:', JSON.stringify(data))
      setPlan(data)
    }
    if (error) console.log('Load plan error:', error)
  }

  function drawChart(data) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    const W = rect.width
    const H = rect.height
    const pad = { top: 10, right: 10, bottom: 10, left: 10 }
    const vals = data.values
    const min = Math.min(...vals) * 0.97
    const max = Math.max(...vals) * 1.01
    const x = i => pad.left + (i / (vals.length - 1)) * (W - pad.left - pad.right)
    const y = v => pad.top + (1 - (v - min) / (max - min)) * (H - pad.top - pad.bottom)
    ctx.strokeStyle = 'rgba(14,13,12,0.06)'
    ctx.lineWidth = 1
    ;[0.25, 0.5, 0.75].forEach(t => {
      const yy = pad.top + t * (H - pad.top - pad.bottom)
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(W - pad.right, yy); ctx.stroke()
    })
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, 'rgba(14,13,12,0.07)')
    grad.addColorStop(1, 'rgba(14,13,12,0)')
    ctx.beginPath()
    ctx.moveTo(x(0), y(vals[0]))
    vals.forEach((v, i) => { if (i > 0) ctx.lineTo(x(i), y(v)) })
    ctx.lineTo(x(vals.length - 1), H)
    ctx.lineTo(x(0), H)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(x(0), y(vals[0]))
    vals.forEach((v, i) => { if (i > 0) ctx.lineTo(x(i), y(v)) })
    ctx.strokeStyle = 'rgba(14,13,12,0.7)'
    ctx.lineWidth = 1.5
    ctx.lineJoin = 'round'
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x(vals.length - 1), y(vals[vals.length - 1]), 3, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(14,13,12,0.9)'
    ctx.fill()
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
              <div className="dash-nw-value">$48,240</div>
              <div className="dash-nw-change">Since January &nbsp;<span className="dash-nw-pos">↑ $6,840 (16.5%)</span></div>
            </div>
            <div className="dash-periods">
              {['3m','6m','1y','all'].map(p => (
                <button key={p} className={`dash-period ${period === p ? 'on' : ''}`} onClick={() => setPeriod(p)}>
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="dash-chart-wrap">
            <canvas className="dash-canvas" ref={canvasRef} style={{ width: '100%', height: '200px', display: 'block' }} />
            <div className="dash-chart-labels">
              {PERIODS[period].labels.map((l, i) => (
                <span key={i} className="dash-chart-label">{l}</span>
              ))}
            </div>
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