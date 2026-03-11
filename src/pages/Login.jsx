import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (email === '24bct020@gmail.com' && password === 'Gunasri1820') {
      localStorage.setItem('user', JSON.stringify({ email }));
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
    setLoading(false);
  };

  const colors = {
    primary: '#8B5CF6',
    primaryDark: '#7C3AED',
    border: '#E0D7FF',
    text: '#1F2937',
    textMuted: '#6B7280'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#F5F3FF',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '28px',
        boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.2)',
        width: '100%',
        maxWidth: '420px',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: colors.primary,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '36px',
            color: 'white',
            border: `1px solid ${colors.border}`
          }}>
            📊
          </div>
          <h2 style={{ color: colors.text, marginBottom: '6px', fontSize: '28px', fontWeight: '700' }}>
            Welcome Back
          </h2>
          <p style={{ color: colors.textMuted, fontSize: '15px' }}>
            Sign in to your account
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2',
            border: `1px solid #EF4444`,
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '24px',
            color: '#EF4444',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: `1px solid ${colors.border}`,
                borderRadius: '14px',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => { e.target.style.borderColor = colors.primary; e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`; }}
              onBlur={(e) => { e.target.style.borderColor = colors.border; e.target.style.boxShadow = 'none'; }}
              required
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: `1px solid ${colors.border}`,
                borderRadius: '14px',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => { e.target.style.borderColor = colors.primary; e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`; }}
              onBlur={(e) => { e.target.style.borderColor = colors.border; e.target.style.boxShadow = 'none'; }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              boxShadow: `0 4px 6px -1px ${colors.primary}40`
            }}
            onMouseOver={(e) => { if (!loading) { e.target.style.background = colors.primaryDark; e.target.style.transform = 'translateY(-1px)'; } }}
            onMouseOut={(e) => { if (!loading) { e.target.style.background = colors.primary; e.target.style.transform = 'translateY(0)'; } }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;