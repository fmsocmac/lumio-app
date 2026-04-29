'use client'

import { useState, useEffect, useRef } from 'react'

const DEFAULT_USER = {
  name: 'Marcus',
  age: 28,
  stage: 'Early career',
  income: 5200,
  savings: 8400,
  debt: 14000,
  debtType: 'Student loans',
  goals: ['Buy a home', 'Grow investments', 'Build emergency fund']
}

const LOAD_MSGS = [
  'Analysing your finances...',
  'Reviewing your spending patterns...',
  'Calculating your investment roadmap...',
  'Mapping your goals...',
  'Writing your personal plan...'
]

export default function Plan() {
  const [user, setUser] = useState(DEFAULT_USER)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState(null)
  const [activeTab, setActiveTab] = useState('budget')
  const [loadMsg, setLoadMsg] = useState(LOAD_MSGS[0])
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [openMonth, setOpenMonth] = useState(0)
  const chatRef = useRef(null)

  useEffect(() => {
  const saved = localStorage.getItem('lumio_user')
  const loadedUser = saved ? JSON.parse(saved) : DEFAULT_USER
  setUser(loadedUser)

  let i = 0
  const iv = setInterval(() => {
      i++
      if (i < LOAD_MSGS.length) {
        setLoadMsg(LOAD_MSGS[i])
      } else {
        clearInterval(iv)
        fetchPlan(loadedUser)
      }
    }, 900)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (plan) {
      setChatMessages([{ who: 'lumio', text: plan.chatIntro }])
    }
  }, [plan])

  async function fetchPlan(u = user) {
    const prompt = `You are Lumio, a personal financial advisor. Generate a complete financial plan for this person.

Profile: ${user.name}, ${user.age}, ${user.stage}
Monthly income: $${user.income}
Savings: $${user.savings}
Debt: $${user.debt} (${user.debtType})
Goals: ${user.goals.join(', ')}

Respond ONLY with a valid JSON object, no markdown, no explanation:
{
  "score": 7.2,
  "summary": "2-3 sentence personal summary addressing them by name",
  "budget": {
    "rows": [
      {"name":"Housing","amount":1400,"pct":70,"tag":""},
      {"name":"Food","amount":600,"pct":35,"tag":"warn"},
      {"name":"Transport","amount":320,"pct":20,"tag":""},
      {"name":"Savings","amount":520,"pct":30,"tag":"good"}
    ],
    "advice": "2-3 sentences of specific budget advice"
  },
  "invest": {
    "intro": "1-2 sentence intro",
    "steps": ["step 1","step 2","step 3","step 4"]
  },
  "goals": [
    {"name":"Goal name","timeline":"X years","monthly":"$X/mo"}
  ],
  "goalsAdvice": "1-2 sentences about their goals",
  "debt": {
    "hasDebt": true,
    "strategy": "2-3 sentences on exact debt payoff strategy",
    "timeline": "Debt-free in X months",
    "monthly": "$X/mo toward debt"
  },
  "action": {
    "month1": ["action 1","action 2","action 3"],
    "month2": ["action 1","action 2","action 3"],
    "month3": ["action 1","action 2","action 3"]
  },
  "chatIntro": "One warm sentence welcoming them and inviting questions"
}`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      const data = await res.json()
      const raw = data.content.map(b => b.text || '').join('')
      const clean = raw.replace(/```json|```/g, '').trim()
      setPlan(JSON.parse(clean))
    } catch (e) {
  console.log('Plan generation failed:', e)
} finally {
  setLoading(false)
}      setLoading(false)
    }
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return
    const q = chatInput.trim()
    setChatInput('')
    setChatMessages(m => [...m, { who: 'user', text: q }])
    setChatLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are Lumio. User plan: ${JSON.stringify(plan)}. Answer in 2-4 sentences, directly and specifically: ${q}`
          }]
        })
      })
      const data = await res.json()
      const reply = data.content.map(b => b.text || '').join('').trim()
      setChatMessages(m => [...m, { who: 'lumio', text: reply }])
    } catch {
      setChatMessages(m => [...m, { who: 'lumio', text: "I'm having trouble connecting. Please try again." }])
    } finally {
      setChatLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="plan-loading">
        <div className="plan-spinner"></div>
        <span className="plan-load-label">Building your plan</span>
        <span className="plan-load-msg">{loadMsg}</span>
      </div>
    )
  }

  return (
    <div className="plan-wrap">
      <nav>
        <a className="logo" href="/">Lumio</a>
        <div className="nav-right">
          <a href="/onboarding" className="nav-link">Retake</a>
          <button className="nav-cta">Upgrade</button>
        </div>
      </nav>

      <div className="plan-header">
        <p className="plan-eyebrow">Your financial plan</p>
        <h1 className="plan-title">Good morning, <em>{user.name}.</em></h1>
        <div className="score-card">
          <div className="score-left">
            <div className="score-label">Financial health</div>
            <p className="score-summary">{plan.summary}</p>
          </div>
          <div className="score-right">
            <div className="score-num">{plan.score}</div>
            <div className="score-denom">out of 10</div>
          </div>
        </div>
      </div>

      <div className="plan-tabs-wrap">
        <div className="plan-tabs">
          {['budget','invest','goals','debt','action','chat'].map(t => (
            <button
              key={t}
              className={`plan-tab ${activeTab === t ? 'on' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t === 'invest' ? 'Investing' : t === 'action' ? 'Action Plan' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="plan-content">

        {activeTab === 'budget' && (
          <div className="panel">
            <div className="budget-rows">
              {plan.budget.rows.map(r => (
                <div className="b-row" key={r.name}>
                  <span className="b-name">{r.name}</span>
                  <div className="b-bar">
                    <div className="b-fill" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="b-val">${r.amount.toLocaleString()}</span>
                  {r.tag && <span className={`b-tag ${r.tag}`}>{r.tag === 'warn' ? 'Review' : 'Good'}</span>}
                </div>
              ))}
            </div>
            <p className="panel-advice">{plan.budget.advice}</p>
          </div>
        )}

        {activeTab === 'invest' && (
          <div className="panel">
            <p className="panel-advice">{plan.invest.intro}</p>
            <h3 className="panel-h3">Your roadmap</h3>
            <ul className="panel-list">
              {plan.invest.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="panel">
            <div className="goal-rows">
              {plan.goals.map(g => (
                <div className="g-row" key={g.name}>
                  <span className="g-name">{g.name}</span>
                  <div className="g-right">
                    <div className="g-monthly">{g.monthly}</div>
                    <div className="g-timeline">{g.timeline}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="panel-advice">{plan.goalsAdvice}</p>
          </div>
        )}

        {activeTab === 'debt' && (
          <div className="panel">
            {plan.debt.hasDebt ? (
              <>
                <p className="panel-advice">{plan.debt.strategy}</p>
                <div className="debt-stats">
                  <div className="debt-stat">
                    <div className="debt-stat-label">Timeline</div>
                    <div className="debt-stat-val">{plan.debt.timeline}</div>
                  </div>
                  <div className="debt-stat">
                    <div className="debt-stat-label">Monthly</div>
                    <div className="debt-stat-val">{plan.debt.monthly}</div>
                  </div>
                </div>
              </>
            ) : (
              <p className="panel-advice">You have no debt — a meaningful strength. Keep it that way by building your emergency fund before taking on any new credit obligations.</p>
            )}
          </div>
        )}

        {activeTab === 'action' && (
          <div className="panel">
            {[
              { label: 'Month 1', items: plan.action.month1 },
              { label: 'Month 2', items: plan.action.month2 },
              { label: 'Month 3', items: plan.action.month3 }
            ].map((m, i) => (
              <div className="month-block" key={i}>
                <button className="month-head" onClick={() => setOpenMonth(openMonth === i ? -1 : i)}>
                  <span className="month-name">{m.label}</span>
                  <span className="month-toggle">{openMonth === i ? 'Collapse' : 'Expand'}</span>
                </button>
                {openMonth === i && (
                  <div className="month-body">
                    {m.items.map((item, j) => (
                      <div className="month-item" key={j}>{item}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="panel">
            <div className="chat-messages" ref={chatRef}>
              {chatMessages.map((m, i) => (
                <div key={i} className={`chat-msg ${m.who}`}>
                  <div className="chat-who">{m.who === 'lumio' ? 'Lumio' : 'You'}</div>
                  <div className="chat-bubble">{m.text}</div>
                </div>
              ))}
              {chatLoading && (
                <div className="chat-msg lumio">
                  <div className="chat-who">Lumio</div>
                  <div className="chat-bubble chat-typing">
                    <span className="t-dot" /><span className="t-dot" /><span className="t-dot" />
                  </div>
                </div>
              )}
            </div>
            <div className="chat-input-wrap">
              <input
                className="chat-input"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Ask anything about your plan..."
              />
              <button className="chat-send" onClick={sendChat}>Send</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}