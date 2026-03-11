import React from 'react';

function BillingHistory({ bills, onDownloadInvoice }) {
  const colors = {
    primary: '#8B5CF6',
    success: '#10B981',
    border: '#E0D7FF',
    text: '#1F2937',
    textMuted: '#6B7280'
  };

  if (!bills || bills.length === 0) {
    return (
      <div style={{ 
        background: 'white',
        borderRadius: '20px',
        padding: '60px 20px',
        textAlign: 'center',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.1)'
      }}>
        <span style={{ fontSize: '48px', color: colors.primary, marginBottom: '16px', display: 'block' }}>📭</span>
        <h3 style={{ color: colors.text, marginBottom: '8px', fontSize: '18px' }}>No payments yet</h3>
        <p style={{ color: colors.textMuted, fontSize: '14px' }}>
          Make your first payment to see history
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '24px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.1)'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
              <th style={{ padding: '12px', textAlign: 'left', color: colors.textMuted, fontWeight: '500' }}>App</th>
              <th style={{ padding: '12px', textAlign: 'left', color: colors.textMuted, fontWeight: '500' }}>Invoice</th>
              <th style={{ padding: '12px', textAlign: 'left', color: colors.textMuted, fontWeight: '500' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', color: colors.textMuted, fontWeight: '500' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', color: colors.textMuted, fontWeight: '500' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', color: colors.textMuted, fontWeight: '500' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} style={{ borderBottom: `1px solid ${colors.border}`, transition: 'all 0.2s ease' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#F8F5FF'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px' }}>
                  <span style={{ marginRight: '8px', fontSize: '20px' }}>{bill.appLogo}</span>
                  <span style={{ color: colors.text, fontWeight: '500' }}>{bill.app}</span>
                </td>
                <td style={{ padding: '12px', color: colors.textMuted }}>{bill.invoice}</td>
                <td style={{ padding: '12px', color: colors.textMuted }}>{bill.date}</td>
                <td style={{ padding: '12px', fontWeight: '600', color: colors.success }}>₹{bill.amount}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    background: '#F0F9FF',
                    color: colors.success,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: `1px solid ${colors.border}`
                  }}>
                    Paid
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => onDownloadInvoice(bill.invoice, bill.app, bill.amount, bill.date)}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: colors.primary,
                      border: `1px solid ${colors.primary}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => { e.target.style.background = colors.primary; e.target.style.color = 'white'; }}
                    onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.color = colors.primary; }}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BillingHistory;