import React from 'react';

function ChartSection({ monthlyData, maxAmount, bills }) {
  if (bills.length === 0) {
    return (
      <div style={{
        background: '#151B2B',
        padding: '50px 20px',
        borderRadius: '16px',
        textAlign: 'center',
        border: '1px solid #2A2F3F'
      }}>
        <span style={{ fontSize: '48px', color: '#2A7DE1' }}>📊</span>
        <h4 style={{ color: '#E1E8ED' }}>No Data</h4>
      </div>
    );
  }

  return (
    <div style={{
      background: '#151B2B',
      padding: '25px',
      borderRadius: '16px',
      border: '1px solid #2A2F3F'
    }}>
      <h3 style={{ color: '#E1E8ED' }}>Spending Chart</h3>
      {/* Chart code here */}
    </div>
  );
}

export default ChartSection;