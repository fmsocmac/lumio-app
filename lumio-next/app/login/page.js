'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="auth-wrap">
      <nav>
        <a className="logo" href="/">Lumio</a>
      </nav>

      <div className="auth-body">
        <div className="auth-card">
          <p className="ob-eyebrow">Welcome back</p>
          <h1 className="ob-title">Sign in to<br /><em>Lumio.</em></h1>

          <div className="ob-fields">
            <div className="ob-field">
              <label className="ob-lbl">Email</label>
              <input
                className="ob-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="ob-field">
              <label className="ob-lbl">Password</label>
              <input
                className="ob-input"
                type="password"
                placeholder="your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            className="ob-next"
            disabled={!email || !password || loading}
            onClick={handleLogin}
            style={{ width: '100%' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="auth-switch">
            Don't have an account? <a href="/signup">Create one</a>
          </p>
        </div>
      </div>
    </div>
  )
}