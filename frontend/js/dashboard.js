import { api } from './api.js';
import { initTheme } from './theme.js';

initTheme();

const token    = localStorage.getItem('token');
const userId   = localStorage.getItem('userId');
const userName = localStorage.getItem('userName') || 'User';

if (!token || !userId) window.location.href = 'index.html';

document.getElementById('nav-name').textContent = userName;
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});

async function loadSubscriptions() {
  const container = document.getElementById('subs-container');
  try {
    const res = await api.getSubscriptions(userId);
    if (!res.success) {
      container.innerHTML = `<p style="color:var(--danger)">Failed to load subscriptions.</p>`;
      return;
    }
    const subs = res.data;
    const active = subs.filter(s => s.status === 'Active');
    const totalMonthly = active.reduce((sum, s) => {
      const amt = s.frequency === 'Yearly' ? s.price / 12
                : s.frequency === 'Weekly' ? s.price * 4.33
                : s.frequency === 'Daily'  ? s.price * 30
                : s.price;
      return sum + amt;
    }, 0);

    document.getElementById('stat-total').textContent  = subs.length;
    document.getElementById('stat-active').textContent = active.length;
    document.getElementById('stat-monthly').textContent = `$${totalMonthly.toFixed(2)}`;

    if (subs.length === 0) {
      container.innerHTML = `
        <div class="empty">
          <div class="empty-icon">📭</div>
          <div class="empty-title">No subscriptions yet</div>
          <p>Add your first subscription to start tracking</p>
          <a href="add.html" class="btn-add" style="display:inline-flex;margin:0 auto">+ Add subscription</a>
        </div>`;
      return;
    }
    container.innerHTML = `<div class="subs-grid">${subs.map(subCard).join('')}</div>`;
  } catch {
    container.innerHTML = `<p style="color:var(--danger)">Error loading data.</p>`;
  }
}

function subCard(s) {
  const renewal = s.renewalDate ? new Date(s.renewalDate).toLocaleDateString() : '—';
  const start   = s.startDate   ? new Date(s.startDate).toLocaleDateString()   : '—';
  const badge   = s.status === 'Active'  ? 'badge-active'
                : s.status === 'Expired' ? 'badge-expired'
                : 'badge-cancelled';
  return `
    <div class="sub-card">
      <div class="sub-card-top">
        <span class="sub-name">${s.name}</span>
        <span class="sub-category">${s.category}</span>
      </div>
      <div class="sub-price">${s.currency || 'USD'} ${s.price}</div>
      <div class="sub-frequency">per ${(s.frequency || 'month').toLowerCase()}</div>
      <div class="sub-meta">
        <span><span>Status</span><span class="badge ${badge}">${s.status}</span></span>
        <span><span>Payment</span><strong>${s.paymentMethod}</strong></span>
        <span><span>Started</span><strong>${start}</strong></span>
        <span><span>Renews</span><strong>${renewal}</strong></span>
      </div>
    </div>`;
}

loadSubscriptions();
