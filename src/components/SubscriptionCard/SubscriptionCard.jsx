import React from 'react';

function SubscriptionCard({ sub, onManageClick }) {
  const brandColors = {
    'Netflix': '#E50914',
    'Spotify': '#1DB954',
    'Amazon Prime': '#00A8E1',
    'Disney+ Hotstar': '#1AA2E6',
    'YouTube Premium': '#FF0000'
  };

  const getBrandLogo = (appName) => {
    switch(appName) {
      case 'Netflix': return 'N';
      case 'Spotify': return '♪';
      case 'Amazon Prime': return '📦';
      case 'Disney+ Hotstar': return '✨';
      case 'YouTube Premium': return '▶️';
      default: return sub.logo;
    }
  };

  const colors = {
    border: '#E0D7FF',
    text: '#1F2937',
    textMuted: '#6B7280',
    success: '#10B981'
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '20px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.1)',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(139, 92, 246, 0.2)';
      e.currentTarget.style.borderColor = brandColors[sub.appName] || '#8B5CF6';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(139, 92, 246, 0.1)';
      e.currentTarget.style.borderColor = colors.border;
    }}>
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: brandColors[sub.appName] || '#8B5CF6'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: brandColors[sub.appName] || '#8B5CF6',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          fontSize: '22px',
          color: 'white',
          fontWeight: 'bold',
          border: `1px solid ${colors.border}`
        }}>
          {getBrandLogo(sub.appName)}
        </div>
        <div>
          <h3 style={{ margin: '0 0 2px 0', fontSize: '18px', fontWeight: '600', color: colors.text }}>{sub.appName}</h3>
          <p style={{ margin: 0, color: colors.textMuted, fontSize: '13px' }}>{sub.category}</p>
        </div>
        <div style={{
          marginLeft: 'auto',
          background: '#FAF5FF',
          color: colors.success,
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          border: `1px solid ${colors.border}`
        }}>
          ● Active
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '20px',
        background: '#F5F3FF',
        padding: '16px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`
      }}>
        <div>
          <p style={{ color: colors.textMuted, fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase' }}>Plan</p>
          <p style={{ fontWeight: '600', fontSize: '15px', color: brandColors[sub.appName] || '#8B5CF6', margin: 0 }}>{sub.plan}</p>
        </div>
        <div>
          <p style={{ color: colors.textMuted, fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase' }}>Price</p>
          <p style={{ fontWeight: '700', fontSize: '20px', color: colors.success, margin: 0 }}>
            ₹{sub.price}<span style={{ fontSize: '10px', color: colors.textMuted, marginLeft: '2px' }}>/mo</span>
          </p>
        </div>
        <div>
          <p style={{ color: colors.textMuted, fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase' }}>Next Bill</p>
          <p style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: 0 }}>{sub.nextBilling}</p>
        </div>
        <div>
          <p style={{ color: colors.textMuted, fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase' }}>Devices</p>
          <p style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: 0 }}>{sub.devices}</p>
        </div>
      </div>

      <button onClick={() => onManageClick(sub)} style={{
        width: '100%',
        padding: '14px',
        background: 'white',
        color: '#8B5CF6',
        border: `1px solid #8B5CF6`,
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.2s ease'
      }}
      onMouseOver={(e) => { e.target.style.background = '#8B5CF6'; e.target.style.color = 'white'; }}
      onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.color = '#8B5CF6'; }}>
        Manage Subscription →
      </button>
    </div>
  );
}

export default SubscriptionCard;