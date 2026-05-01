'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: email,
        })
      }
      window.location.href = '/onboarding'
    }
  }

  return (
    <div className="auth-wrap">
      <nav>
        <a className="logo" href="/">Lumio</a>
      </nav>
      <div className="auth-body">
        <div className="auth-card">
          <p className="ob-eyebrow">Create account</p>
          <h1 className="ob-title">Get started with<br /><em>Lumio.</em></h1>
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
                placeholder="minimum 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button
            className="ob-next"
            disabled={!email || !password || loading}
            onClick={handleSignup}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          <p className="auth-switch">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}