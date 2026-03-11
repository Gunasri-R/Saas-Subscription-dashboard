import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import SubscriptionCard from '../components/SubscriptionCard/SubscriptionCard';

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const subsData = await api.getSubscriptions();
      setSubscriptions(subsData);
      const localBills = JSON.parse(localStorage.getItem('bills') || '[]');
      setBills(localBills);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageClick = (subscription) => {
    setSelectedSub(subscription);
    setShowPlanModal(true);
  };

  const handlePlanChange = async (newPlan, newPrice) => {
    if (!selectedSub) return;
    
    setUpdating(true);
    try {
      await api.updatePlan(selectedSub.id, newPlan, newPrice);
      
      setSubscriptions(subscriptions.map(sub => 
        sub.id === selectedSub.id 
          ? { ...sub, plan: newPlan, price: newPrice }
          : sub
      ));
      
      const paymentMethods = ['UPI - Google Pay', 'UPI - PhonePe', 'Credit Card', 'Debit Card', 'Net Banking'];
      const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      const paymentInfo = {
        appName: selectedSub.appName,
        appLogo: selectedSub.logo,
        appColor: selectedSub.color,
        oldPlan: selectedSub.plan,
        oldPrice: selectedSub.price,
        newPlan: newPlan,
        newPrice: newPrice,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString(),
        transactionId: `TXN${Date.now().toString().slice(-8)}`,
        paymentMethod: randomMethod,
        invoice: `INV-${selectedSub.appName.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}`
      };
      
      setPaymentDetails(paymentInfo);
      
      const newBill = {
        id: Date.now(),
        app: selectedSub.appName,
        appLogo: selectedSub.logo,
        invoice: paymentInfo.invoice,
        date: paymentInfo.date,
        amount: newPrice,
        status: 'Paid',
        paymentMethod: randomMethod
      };
      
      const existingBills = JSON.parse(localStorage.getItem('bills') || '[]');
      const updatedBills = [newBill, ...existingBills];
      localStorage.setItem('bills', JSON.stringify(updatedBills));
      
      setBills(updatedBills);
      setShowPlanModal(false);
      setSelectedSub(null);
      setShowPaymentPopup(true);
      
    } catch (error) {
      alert('Failed to update plan. Please try again.');
    } finally {
      setUpdating(false);
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
          <p style={{ marginTop: '20px', color: '#8B5CF6' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const totalSpend = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const userEmail = JSON.parse(localStorage.getItem('user'))?.email || '24bct020@gmail.com';

  const colors = {
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    primaryDark: '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    bg: '#F5F3FF',
    card: '#FFFFFF',
    border: '#E0D7FF',
    text: '#1F2937',
    textMuted: '#6B7280'
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: colors.bg,
      padding: '24px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px 32px',
          marginBottom: '28px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '30px', margin: '0 0 6px 0', color: colors.text, fontWeight: '700' }}>
                <span style={{ color: colors.primary, marginRight: '8px' }}>📊</span> 
                Subscription Hub
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
                }}>
                  {userEmail}
                </span>
                • {bills.length} transactions
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

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '35px'
        }}>
          {[
            { label: 'Active Subscriptions', value: subscriptions.length, icon: '📱', color: colors.primary },
            { label: 'Total Spent', value: `₹${totalSpend}`, icon: '💰', color: colors.success },
            { label: 'Transactions', value: bills.length, icon: '📄', color: colors.primaryLight },
            { label: 'Monthly Average', value: `₹${bills.length > 0 ? (totalSpend / bills.length).toFixed(0) : 0}`, icon: '📊', color: colors.warning }
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '24px',
                border: `1px solid ${colors.border}`,
                boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.1)',
                transition: 'all 0.2s ease',
                animation: `fadeIn 0.4s ease-out ${index * 0.1}s both`
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(139, 92, 246, 0.2)';
                e.currentTarget.style.borderColor = stat.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(139, 92, 246, 0.1)';
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: colors.textMuted, fontSize: '14px', fontWeight: '500' }}>{stat.label}</span>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#F0E9FF',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: stat.color,
                  border: `1px solid ${colors.border}`
                }}>
                  {stat.icon}
                </div>
              </div>
              <p style={{ fontSize: '34px', fontWeight: '700', color: colors.text, margin: '0 0 4px 0' }}>{stat.value}</p>
              <p style={{ color: stat.color, fontSize: '13px', margin: 0, fontWeight: '500' }}>Active now</p>
            </div>
          ))}
        </div>

        {/* Subscriptions Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            color: colors.text, 
            fontSize: '22px', 
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ 
              background: colors.primary,
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              ✨
            </span>
            Your Subscriptions
          </h2>
          <div style={{
            background: 'white',
            padding: '8px 20px',
            borderRadius: '30px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 2px 4px rgba(139, 92, 246, 0.05)'
          }}>
            <span style={{ color: colors.primary, fontSize: '15px', fontWeight: '600' }}>
              {subscriptions.length} active
            </span>
          </div>
        </div>

        {/* Subscriptions Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {subscriptions.map((sub, index) => (
            <div key={sub.id} style={{ animation: `fadeIn 0.4s ease-out ${index * 0.1}s both` }}>
              <SubscriptionCard sub={sub} onManageClick={handleManageClick} />
            </div>
          ))}
        </div>
      </div>

      {/* Plan Change Modal */}
      {showPlanModal && selectedSub && (
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
        }} onClick={() => !updating && setShowPlanModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '28px',
            padding: '36px',
            maxWidth: '500px',
            width: '90%',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: selectedSub.color,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                color: 'white'
              }}>
                {selectedSub.logo}
              </div>
              <div>
                <h3 style={{ color: colors.text, fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0' }}>
                  {selectedSub.appName}
                </h3>
                <p style={{ color: colors.textMuted, margin: 0, fontSize: '14px' }}>Change your plan</p>
              </div>
              <button onClick={() => !updating && setShowPlanModal(false)} style={{
                marginLeft: 'auto',
                background: '#F3F4F6',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                fontSize: '18px',
                cursor: 'pointer',
                color: colors.textMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>✕</button>
            </div>

            <div style={{
              background: '#F8F5FF',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              border: `1px solid ${colors.border}`
            }}>
              <p style={{ color: colors.textMuted, fontSize: '13px', marginBottom: '8px' }}>Current Plan</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: selectedSub.color, margin: 0 }}>
                {selectedSub.plan} • ₹{selectedSub.price}/month
              </p>
            </div>

            <h4 style={{ color: colors.text, marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
              Available Plans
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedSub.availablePlans.map((plan) => (
                <button key={plan.name}
                  onClick={() => handlePlanChange(plan.name, plan.price)}
                  disabled={updating || plan.name === selectedSub.plan}
                  style={{
                    padding: '18px',
                    background: plan.name === selectedSub.plan ? '#F0E9FF' : 'white',
                    color: plan.name === selectedSub.plan ? colors.primary : colors.text,
                    border: plan.name === selectedSub.plan ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                    borderRadius: '16px',
                    cursor: updating || plan.name === selectedSub.plan ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{plan.name}</span>
                  <span style={{ 
                    fontWeight: '700', 
                    color: colors.success,
                    background: '#E6F7F0',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: `1px solid ${colors.border}`
                  }}>
                    ₹{plan.price}/mo
                  </span>
                </button>
              ))}
            </div>

            <button onClick={() => setShowPlanModal(false)} disabled={updating} style={{
              width: '100%',
              padding: '16px',
              marginTop: '24px',
              background: 'white',
              border: `1px solid ${colors.border}`,
              color: colors.textMuted,
              borderRadius: '14px',
              cursor: updating ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: '600'
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Payment Success Popup */}
      {showPaymentPopup && paymentDetails && (
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
          zIndex: 2000,
          padding: '20px'
        }} onClick={() => setShowPaymentPopup(false)}>
          <div style={{
            background: 'white',
            borderRadius: '28px',
            padding: '36px',
            maxWidth: '440px',
            width: '100%',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.2)',
            textAlign: 'center'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              width: '72px',
              height: '72px',
              background: '#E6F7F0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '36px',
              color: colors.success,
              border: `1px solid ${colors.border}`
            }}>✓</div>

            <h2 style={{ color: colors.success, marginBottom: '8px', fontSize: '28px', fontWeight: '700' }}>
              Payment Successful!
            </h2>
            
            <p style={{ color: colors.textMuted, marginBottom: '28px', fontSize: '15px' }}>
              Your subscription has been updated
            </p>

            <div style={{
              background: '#F8F5FF',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '28px',
              textAlign: 'left',
              border: `1px solid ${colors.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: paymentDetails.appColor,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  color: 'white',
                  border: `1px solid ${colors.border}`
                }}>
                  {paymentDetails.appLogo}
                </div>
                <div>
                  <h3 style={{ color: colors.text, fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>
                    {paymentDetails.appName}
                  </h3>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'white',
                padding: '16px',
                borderRadius: '16px',
                marginBottom: '20px',
                border: `1px solid ${colors.border}`
              }}>
                <div>
                  <p style={{ color: colors.textMuted, fontSize: '11px', marginBottom: '4px' }}>Old Plan</p>
                  <p style={{ fontWeight: '700', color: colors.danger }}>{paymentDetails.oldPlan}</p>
                </div>
                <span style={{ fontSize: '20px', color: colors.primary }}>→</span>
                <div>
                  <p style={{ color: colors.textMuted, fontSize: '11px', marginBottom: '4px' }}>New Plan</p>
                  <p style={{ fontWeight: '700', color: colors.success }}>{paymentDetails.newPlan}</p>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: colors.textMuted }}>Amount:</span>
                  <span style={{ fontWeight: '700', color: colors.success }}>₹{paymentDetails.newPrice}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <button onClick={() => { setShowPaymentPopup(false); navigate('/billing'); }} style={{
                flex: 1,
                padding: '16px',
                background: colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}>View Bill</button>
              <button onClick={() => setShowPaymentPopup(false)} style={{
                flex: 1,
                padding: '16px',
                background: 'white',
                color: colors.textMuted,
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;