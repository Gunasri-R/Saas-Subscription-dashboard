import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Analytics() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showMonthDetails, setShowMonthDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { 
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      const localBills = JSON.parse(localStorage.getItem('bills') || '[]');
      setBills(localBills);
    } catch (error) {
      console.error('Error:', error);
    } finally { 
      setLoading(false); 
    }
  };

  const handleLogout = () => { 
    localStorage.removeItem('user'); 
    navigate('/login'); 
  };
  
  const navigateTo = (page) => { 
    setActiveTab(page); 
    navigate(`/${page}`); 
  };

  // Get current date for display
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Prepare monthly data based on selected period
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  let monthlyData = [];
  let monthlyLabels = [];
  let monthlyFullLabels = [];
  let monthlyHasData = [];
  let monthlyTransactions = [];
  
  const today = new Date();
  const periods = {
    '3months': 3,
    '6months': 6,
    '12months': 12
  };
  
  const monthsToShow = periods[selectedPeriod] || 12;
  
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = months[d.getMonth()];
    const fullMonthName = fullMonths[d.getMonth()];
    const year = d.getFullYear();
    const label = `${monthName} ${year}`;
    const fullLabel = `${fullMonthName} ${year}`;
    
    const monthBills = bills.filter(bill => {
      const billDate = new Date(bill.date);
      return billDate.getMonth() === d.getMonth() && billDate.getFullYear() === d.getFullYear();
    });
    
    const monthTotal = monthBills.reduce((sum, bill) => sum + bill.amount, 0);
    const hasData = monthBills.length > 0;
    
    monthlyData.push(monthTotal);
    monthlyLabels.push(label);
    monthlyFullLabels.push(fullLabel);
    monthlyHasData.push(hasData);
    monthlyTransactions.push(monthBills);
  }

  // Handle month click
  const handleMonthClick = (index) => {
    if (monthlyHasData[index]) {
      setSelectedMonth({
        index,
        label: monthlyFullLabels[index],
        amount: monthlyData[index],
        transactions: monthlyTransactions[index],
        month: monthlyLabels[index]
      });
      setShowMonthDetails(true);
    }
  };

  // Calculate statistics
  const totalSpent = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const maxValue = Math.max(...monthlyData, 1);
  const chartHeight = 350;
  
  // Calculate growth percentage
  const previousPeriodTotal = monthlyData.slice(0, Math.floor(monthsToShow/2)).reduce((a, b) => a + b, 0);
  const currentPeriodTotal = monthlyData.slice(Math.floor(monthsToShow/2)).reduce((a, b) => a + b, 0);
  const growthPercentage = previousPeriodTotal > 0 
    ? ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal * 100).toFixed(1) 
    : 0;

  const colors = {
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    primaryDark: '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    border: '#E0D7FF',
    text: '#1F2937',
    textMuted: '#6B7280',
    cardBg: '#FFFFFF',
    chartBar: '#8B5CF6',
    chartBarLight: '#F0E9FF',
    chartBarEmpty: '#F3F4F6'
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: '#F5F3FF' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '20px', color: colors.primary }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const userEmail = JSON.parse(localStorage.getItem('user'))?.email || '24bct020@gmail.com';

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#F5F3FF', 
      padding: '24px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header with Date */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '24px',
          padding: '28px 32px',
          marginBottom: '28px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 8px 20px -8px rgba(139, 92, 246, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                background: colors.primary,
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white'
              }}>
                📊
              </div>
              <div>
                <h1 style={{ fontSize: '28px', margin: 0, color: colors.text, fontWeight: '700' }}>
                  Analytics Dashboard
                </h1>
                <p style={{ color: colors.primary, fontSize: '15px', margin: '4px 0 0', fontWeight: '500' }}>
                  {getCurrentDate()}
                </p>
              </div>
            </div>
            <p style={{ color: colors.textMuted, margin: '8px 0 0', fontSize: '14px' }}>
              <span style={{ 
                background: '#F0E9FF',
                padding: '4px 12px',
                borderRadius: '30px',
                color: colors.primary,
                fontWeight: '600',
                marginRight: '12px',
                border: `1px solid ${colors.border}`
              }}>
                {userEmail}
              </span>
              • {bills.length} transactions • ₹{totalSpent} total spent
            </p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
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
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = colors.danger;
              e.target.style.color = 'white';
              e.target.style.borderColor = colors.danger;
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = colors.danger;
              e.target.style.borderColor = colors.border;
            }}
          >
            <span>🚪</span> Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '16px',
          padding: '6px',
          marginBottom: '28px',
          display: 'flex',
          gap: '6px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 4px 10px -6px rgba(139, 92, 246, 0.1)'
        }}>
          {[
            { name: 'Dashboard', path: 'dashboard', icon: '📋' },
            { name: 'Billing', path: 'billing', icon: '💰' },
            { name: 'Analytics', path: 'analytics', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.path}
              onClick={() => navigateTo(tab.path)}
              style={{
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
                gap: '10px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Period Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ color: colors.text, fontSize: '18px', fontWeight: '600', margin: 0 }}>
            Spending Overview
          </h2>
          <div style={{
            background: colors.cardBg,
            padding: '4px',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            display: 'inline-flex',
            gap: '4px'
          }}>
            {['3months', '6months', '12months'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                style={{
                  padding: '8px 16px',
                  background: selectedPeriod === period ? colors.primary : 'transparent',
                  color: selectedPeriod === period ? 'white' : colors.textMuted,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: selectedPeriod === period ? '600' : '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {period === '3months' ? '3 Months' : period === '6months' ? '6 Months' : '12 Months'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '28px'
        }}>
          {/* Total Spent Card */}
          <div style={{
            background: colors.cardBg,
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 10px -6px rgba(139, 92, 246, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 12px 20px -10px ${colors.primary}60`;
            e.currentTarget.style.borderColor = colors.primary;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 10px -6px rgba(139, 92, 246, 0.1)';
            e.currentTarget.style.borderColor = colors.border;
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: colors.textMuted, fontSize: '13px', fontWeight: '500' }}>Total Spent</span>
              <div style={{
                width: '36px',
                height: '36px',
                background: '#F0E9FF',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: colors.primary,
                border: `1px solid ${colors.border}`
              }}>💰</div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: '700', color: colors.text, margin: '0 0 4px 0' }}>₹{totalSpent}</p>
            <p style={{ color: colors.textMuted, fontSize: '12px', margin: 0 }}>Lifetime total</p>
          </div>

          {/* Transactions Card */}
          <div style={{
            background: colors.cardBg,
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 10px -6px rgba(139, 92, 246, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 12px 20px -10px ${colors.primaryLight}60`;
            e.currentTarget.style.borderColor = colors.primaryLight;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 10px -6px rgba(139, 92, 246, 0.1)';
            e.currentTarget.style.borderColor = colors.border;
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: colors.textMuted, fontSize: '13px', fontWeight: '500' }}>Transactions</span>
              <div style={{
                width: '36px',
                height: '36px',
                background: '#F0E9FF',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: colors.primaryLight,
                border: `1px solid ${colors.border}`
              }}>📄</div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: '700', color: colors.text, margin: '0 0 4px 0' }}>{bills.length}</p>
            <p style={{ color: colors.textMuted, fontSize: '12px', margin: 0 }}>Total payments</p>
          </div>

          {/* Monthly Average Card */}
          <div style={{
            background: colors.cardBg,
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 10px -6px rgba(139, 92, 246, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 12px 20px -10px ${colors.success}60`;
            e.currentTarget.style.borderColor = colors.success;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 10px -6px rgba(139, 92, 246, 0.1)';
            e.currentTarget.style.borderColor = colors.border;
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: colors.textMuted, fontSize: '13px', fontWeight: '500' }}>Monthly Avg</span>
              <div style={{
                width: '36px',
                height: '36px',
                background: '#E6F7F0',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: colors.success,
                border: `1px solid ${colors.border}`
              }}>📊</div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: '700', color: colors.text, margin: '0 0 4px 0' }}>
              ₹{bills.length > 0 ? (totalSpent / 12).toFixed(0) : 0}
            </p>
            <p style={{ color: colors.textMuted, fontSize: '12px', margin: 0 }}>Per month average</p>
          </div>

          {/* Growth Card */}
          <div style={{
            background: colors.cardBg,
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 10px -6px rgba(139, 92, 246, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 12px 20px -10px ${growthPercentage >= 0 ? colors.success : colors.danger}60`;
            e.currentTarget.style.borderColor = growthPercentage >= 0 ? colors.success : colors.danger;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 10px -6px rgba(139, 92, 246, 0.1)';
            e.currentTarget.style.borderColor = colors.border;
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: colors.textMuted, fontSize: '13px', fontWeight: '500' }}>Growth</span>
              <div style={{
                width: '36px',
                height: '36px',
                background: growthPercentage >= 0 ? '#E6F7F0' : '#FEF2F2',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: growthPercentage >= 0 ? colors.success : colors.danger,
                border: `1px solid ${colors.border}`
              }}>{growthPercentage >= 0 ? '📈' : '📉'}</div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: '700', color: growthPercentage >= 0 ? colors.success : colors.danger, margin: '0 0 4px 0' }}>
              {growthPercentage > 0 ? '+' : ''}{growthPercentage}%
            </p>
            <p style={{ color: colors.textMuted, fontSize: '12px', margin: 0 }}>
              {growthPercentage >= 0 ? 'Increase' : 'Decrease'} from previous period
            </p>
          </div>
        </div>

        {/* Chart Card */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '24px',
          padding: '28px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 8px 20px -8px rgba(139, 92, 246, 0.15)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ color: colors.text, fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>
                📈 Spending Trend {selectedPeriod === '3months' ? '(Last 3 Months)' : 
                                   selectedPeriod === '6months' ? '(Last 6 Months)' : '(Last 12 Months)'}
              </h3>
              <p style={{ color: colors.textMuted, fontSize: '13px', margin: 0 }}>
                Click on any bar to see monthly details • Purple = Paid months • Gray = No payments
              </p>
            </div>
            {bills.length > 0 && (
              <div style={{
                background: '#F0E9FF',
                padding: '8px 16px',
                borderRadius: '30px',
                border: `1px solid ${colors.border}`
              }}>
                <span style={{ color: colors.primary, fontSize: '13px', fontWeight: '600' }}>
                  Peak: ₹{Math.max(...monthlyData)}
                </span>
              </div>
            )}
          </div>
          
          {bills.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 20px', 
              color: colors.textMuted, 
              border: `2px dashed ${colors.border}`, 
              borderRadius: '16px',
              background: '#FAF8FF'
            }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px', color: colors.primary }}>📊</span>
              <h4 style={{ color: colors.text, marginBottom: '8px', fontSize: '18px' }}>No Data to Display</h4>
              <p style={{ color: colors.textMuted, fontSize: '14px' }}>
                Make your first payment to see spending analytics
              </p>
            </div>
          ) : (
            <>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-end', 
                height: `${chartHeight}px`,
                gap: '8px',
                marginTop: '10px',
                padding: '0 5px'
              }}>
                {monthlyData.map((value, index) => (
                  <div key={index} style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {/* Bar with hover effect */}
                    <div
                      onClick={() => handleMonthClick(index)}
                      style={{
                        width: '100%',
                        height: `${(value / maxValue) * (chartHeight - 100)}px`,
                        background: monthlyHasData[index] 
                          ? 'linear-gradient(180deg, #8B5CF6 0%, #A78BFA 100%)' 
                          : '#F3F4F6',
                        borderRadius: '8px 8px 0 0',
                        minHeight: '8px',
                        border: monthlyHasData[index] 
                          ? `1px solid ${colors.primary}` 
                          : `1px dashed ${colors.border}`,
                        transition: 'all 0.2s ease',
                        cursor: monthlyHasData[index] ? 'pointer' : 'default',
                        boxShadow: monthlyHasData[index] ? '0 4px 8px rgba(139, 92, 246, 0.2)' : 'none',
                        position: 'relative'
                      }}
                      onMouseOver={(e) => {
                        if (monthlyHasData[index]) {
                          e.target.style.transform = 'scaleY(1.05)';
                          e.target.style.boxShadow = '0 6px 12px rgba(139, 92, 246, 0.3)';
                          // Show tooltip
                          const tooltip = e.target.parentElement.querySelector('.bar-tooltip');
                          if (tooltip) tooltip.style.opacity = '1';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (monthlyHasData[index]) {
                          e.target.style.transform = 'scaleY(1)';
                          e.target.style.boxShadow = '0 4px 8px rgba(139, 92, 246, 0.2)';
                          // Hide tooltip
                          const tooltip = e.target.parentElement.querySelector('.bar-tooltip');
                          if (tooltip) tooltip.style.opacity = '0';
                        }
                      }}
                    >
                      {/* Tooltip */}
                      {monthlyHasData[index] && (
                        <div className="bar-tooltip" style={{
                          position: 'absolute',
                          top: '-30px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: colors.primary,
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          pointerEvents: 'none',
                          zIndex: 10
                        }}>
                          ₹{value}
                        </div>
                      )}
                    </div>
                    
                    {/* Month label - now horizontal and readable */}
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      <span style={{ 
                        fontSize: '12px',
                        color: monthlyHasData[index] ? colors.primary : colors.textMuted,
                        fontWeight: monthlyHasData[index] ? '600' : '400'
                      }}>
                        {monthlyLabels[index]}
                      </span>
                      {monthlyHasData[index] ? (
                        <span style={{ 
                          fontSize: '10px',
                          color: colors.success,
                          fontWeight: '600',
                          background: '#E6F7F0',
                          padding: '2px 6px',
                          borderRadius: '10px'
                        }}>
                          ● Paid
                        </span>
                      ) : (
                        <span style={{ 
                          fontSize: '10px',
                          color: colors.textMuted
                        }}>
                          No payment
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: `1px solid ${colors.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    background: 'linear-gradient(180deg, #8B5CF6 0%, #A78BFA 100%)',
                    borderRadius: '4px'
                  }} />
                  <span style={{ color: colors.textMuted, fontSize: '13px' }}>Months with payments</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    background: '#F3F4F6',
                    borderRadius: '4px',
                    border: `1px dashed ${colors.border}`
                  }} />
                  <span style={{ color: colors.textMuted, fontSize: '13px' }}>No payments</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: colors.primary, fontSize: '13px' }}>👆 Click bars for details</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Month Details Modal */}
        {showMonthDetails && selectedMonth && (
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
          }} onClick={() => setShowMonthDetails(false)}>
            <div style={{
              background: colors.cardBg,
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.2)'
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: colors.text, fontSize: '20px', fontWeight: '700', margin: 0 }}>
                  {selectedMonth.label}
                </h3>
                <button onClick={() => setShowMonthDetails(false)} style={{
                  background: '#F3F4F6',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.textMuted
                }}>✕</button>
              </div>

              <div style={{
                background: '#F0E9FF',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <p style={{ color: colors.textMuted, fontSize: '13px', marginBottom: '8px' }}>Total Spent</p>
                <p style={{ color: colors.primary, fontSize: '32px', fontWeight: '700', margin: 0 }}>
                  ₹{selectedMonth.amount}
                </p>
              </div>

              <h4 style={{ color: colors.text, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Transactions ({selectedMonth.transactions.length})
              </h4>

              {selectedMonth.transactions.length > 0 ? (
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {selectedMonth.transactions.map((tx, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      borderBottom: idx < selectedMonth.transactions.length - 1 ? `1px solid ${colors.border}` : 'none'
                    }}>
                      <div>
                        <span style={{ fontWeight: '600', color: colors.text }}>{tx.app}</span>
                        <p style={{ color: colors.textMuted, fontSize: '11px', margin: '2px 0 0' }}>{tx.invoice}</p>
                      </div>
                      <span style={{ fontWeight: '700', color: colors.success }}>₹{tx.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: colors.textMuted, fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                  No transactions this month
                </p>
              )}

              <button onClick={() => setShowMonthDetails(false)} style={{
                width: '100%',
                padding: '14px',
                marginTop: '20px',
                background: colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600'
              }}>Close</button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {bills.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}>
            {/* Highest Spending Month */}
            <div style={{
              background: colors.cardBg,
              borderRadius: '20px',
              padding: '20px',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 4px 10px -6px rgba(139, 92, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              const peakIndex = monthlyData.indexOf(Math.max(...monthlyData));
              handleMonthClick(peakIndex);
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 12px 20px -10px ${colors.warning}60`;
              e.currentTarget.style.borderColor = colors.warning;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px -6px rgba(139, 92, 246, 0.1)';
              e.currentTarget.style.borderColor = colors.border;
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#FEF3E2',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: colors.warning,
                border: `1px solid ${colors.border}`
              }}>🏆</div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Highest Spending</p>
                <p style={{ color: colors.text, fontSize: '16px', fontWeight: '600', marginBottom: '2px' }}>
                  {monthlyLabels[monthlyData.indexOf(Math.max(...monthlyData))]}
                </p>
                <p style={{ color: colors.warning, fontSize: '14px', fontWeight: '700', margin: 0 }}>
                  ₹{Math.max(...monthlyData)}
                </p>
              </div>
            </div>

            {/* Lowest Spending Month */}
            <div style={{
              background: colors.cardBg,
              borderRadius: '20px',
              padding: '20px',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 4px 10px -6px rgba(139, 92, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              const lowIndex = monthlyData.indexOf(Math.min(...monthlyData.filter(v => v > 0)));
              if (lowIndex >= 0) handleMonthClick(lowIndex);
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 12px 20px -10px ${colors.success}60`;
              e.currentTarget.style.borderColor = colors.success;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px -6px rgba(139, 92, 246, 0.1)';
              e.currentTarget.style.borderColor = colors.border;
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#E6F7F0',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: colors.success,
                border: `1px solid ${colors.border}`
              }}>📉</div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Lowest Spending</p>
                <p style={{ color: colors.text, fontSize: '16px', fontWeight: '600', marginBottom: '2px' }}>
                  {monthlyLabels[monthlyData.indexOf(Math.min(...monthlyData.filter(v => v > 0)))] || 'N/A'}
                </p>
                <p style={{ color: colors.success, fontSize: '14px', fontWeight: '700', margin: 0 }}>
                  ₹{Math.min(...monthlyData.filter(v => v > 0)) || 0}
                </p>
              </div>
            </div>

            {/* Total Months Active */}
            <div style={{
              background: colors.cardBg,
              borderRadius: '20px',
              padding: '20px',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 4px 10px -6px rgba(139, 92, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#F0E9FF',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: colors.primary,
                border: `1px solid ${colors.border}`
              }}>📅</div>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Active Months</p>
                <p style={{ color: colors.text, fontSize: '24px', fontWeight: '700', marginBottom: '2px' }}>
                  {monthlyData.filter(v => v > 0).length}
                </p>
                <p style={{ color: colors.primary, fontSize: '12px', margin: 0 }}>out of {monthsToShow} months</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;