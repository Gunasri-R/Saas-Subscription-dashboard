import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BillingHistory from '../components/BillingHistory/BillingHistory';

function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('billing');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchBills(); }, []);

  const fetchBills = async () => {
    try {
      const localBills = JSON.parse(localStorage.getItem('bills') || '[]');
      setBills(localBills);
    } catch (error) {
      console.error('Error:', error);
    } finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };
  const navigateTo = (page) => { setActiveTab(page); navigate(`/${page}`); };

  const downloadInvoice = (invoice, app, amount, date) => {
    const content = `INVOICE\n\nApp: ${app}\nInvoice: ${invoice}\nDate: ${date}\nAmount: ₹${amount}\nStatus: Paid\n\nThank you!`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice}.txt`;
    link.click();
  };

  const clearAllBills = () => { localStorage.removeItem('bills'); setBills([]); setShowClearConfirm(false); };

  const colors = {
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    success: '#10B981',
    danger: '#EF4444',
    border: '#E0D7FF',
    text: '#1F2937',
    textMuted: '#6B7280'
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F5F3FF' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '20px', color: colors.primary }}>Loading billing history...</p>
        </div>
      </div>
    );
  }

  const totalSpent = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const userEmail = JSON.parse(localStorage.getItem('user'))?.email || '24bct020@gmail.com';

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3FF', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px 32px',
          marginBottom: '28px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '30px', margin: '0 0 6px 0', color: colors.text, fontWeight: '700' }}>
              <span style={{ color: colors.primary }}>💰</span> Billing
            </h1>
            <p style={{ color: colors.textMuted, margin: 0, fontSize: '15px' }}>
              <span style={{ 
                background: '#F0E9FF',
                padding: '4px 10px',
                borderRadius: '20px',
                color: colors.primary,
                fontWeight: '600',
                marginRight: '8px',
                border: `1px solid ${colors.border}`
              }}>{userEmail}</span>
              • {bills.length} transactions
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {bills.length > 0 && (
              <button onClick={() => setShowClearConfirm(true)} style={{
                padding: '12px 24px',
                background: 'white',
                color: colors.danger,
                border: `1px solid ${colors.border}`,
                borderRadius: '14px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => { e.target.style.background = colors.danger; e.target.style.color = 'white'; e.target.style.borderColor = colors.danger; }}
              onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.color = colors.danger; e.target.style.borderColor = colors.border; }}>
                <span>🗑️</span> Clear
              </button>
            )}
            <button onClick={handleLogout} style={{
              padding: '12px 28px',
              background: 'white',
              color: colors.danger,
              border: `1px solid ${colors.border}`,
              borderRadius: '14px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => { e.target.style.background = colors.danger; e.target.style.color = 'white'; e.target.style.borderColor = colors.danger; }}
            onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.color = colors.danger; e.target.style.borderColor = colors.border; }}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '6px',
          marginBottom: '28px',
          display: 'flex',
          gap: '6px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 2px 4px rgba(139, 92, 246, 0.05)'
        }}>
          {[
            { name: 'Dashboard', path: 'dashboard', icon: '📋' },
            { name: 'Billing', path: 'billing', icon: '💰' },
            { name: 'Analytics', path: 'analytics', icon: '📊' }
          ].map((tab) => (
            <button key={tab.path} onClick={() => navigateTo(tab.path)} style={{
              padding: '14px 24px',
              background: activeTab === tab.path ? colors.primary : 'transparent',
              color: activeTab === tab.path ? 'white' : colors.textMuted,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === tab.path ? '600' : '500',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <span>{tab.icon}</span> {tab.name}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '30px' }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(139, 92, 246, 0.2)'; e.currentTarget.style.borderColor = colors.primary; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(139, 92, 246, 0.1)'; e.currentTarget.style.borderColor = colors.border; }}>
            <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '8px' }}>Total Spent</p>
            <p style={{ fontSize: '34px', fontWeight: '700', color: colors.primary, margin: 0 }}>₹{totalSpent}</p>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(139, 92, 246, 0.2)'; e.currentTarget.style.borderColor = colors.primaryLight; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(139, 92, 246, 0.1)'; e.currentTarget.style.borderColor = colors.border; }}>
            <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '8px' }}>Transactions</p>
            <p style={{ fontSize: '34px', fontWeight: '700', color: colors.primaryLight, margin: 0 }}>{bills.length}</p>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(139, 92, 246, 0.2)'; e.currentTarget.style.borderColor = colors.success; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(139, 92, 246, 0.1)'; e.currentTarget.style.borderColor = colors.border; }}>
            <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '8px' }}>Average</p>
            <p style={{ fontSize: '34px', fontWeight: '700', color: colors.success, margin: 0 }}>
              ₹{bills.length > 0 ? (totalSpent / bills.length).toFixed(0) : 0}
            </p>
          </div>
        </div>

        {/* Billing History Component */}
        <BillingHistory bills={bills} onDownloadInvoice={downloadInvoice} />
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowClearConfirm(false)}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '360px',
            width: '90%',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.2)',
            textAlign: 'center'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              width: '56px',
              height: '56px',
              background: '#FEF2F2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '28px',
              color: colors.danger,
              border: `1px solid ${colors.border}`
            }}>⚠️</div>
            <h3 style={{ color: colors.text, marginBottom: '10px', fontSize: '20px', fontWeight: '600' }}>Clear History?</h3>
            <p style={{ color: colors.textMuted, marginBottom: '24px', fontSize: '15px' }}>
              Delete all {bills.length} transactions?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={clearAllBills} style={{
                flex: 1,
                padding: '14px',
                background: colors.danger,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600'
              }}>Yes, Clear</button>
              <button onClick={() => setShowClearConfirm(false)} style={{
                flex: 1,
                padding: '14px',
                background: 'white',
                color: colors.textMuted,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600'
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Billing;