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

    document.getElementById('stat-total').textContent   = subs.length;
    document.getElementById('stat-active').textContent  = active.length;
    // document.getElementById('stat-monthly').textContent = `$${totalMonthly.toFixed(2)}`;
    // Group total by currency
    const byCurrency = {};
    active.forEach(s => {
      const cur = s.currency || 'USD';
      const amt = s.frequency === 'Yearly' ? s.price / 12
                : s.frequency === 'Weekly' ? s.price * 4.33
                : s.frequency === 'Daily'  ? s.price * 30
                : s.price;
      byCurrency[cur] = (byCurrency[cur] || 0) + amt;
    });
    const monthlyText = Object.entries(byCurrency)
      .map(([cur, amt]) => `${cur} ${amt.toFixed(2)}`)
      .join(' + ');
    document.getElementById('stat-monthly').textContent = monthlyText || '0';

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
    attachCardEvents();
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
    <div class="sub-card" data-id="${s._id}">
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
      <div class="card-actions">
        <button class="btn-edit" data-id="${s._id}" data-sub='${JSON.stringify(s)}'>✏️ Edit</button>
        <button class="btn-delete" data-id="${s._id}">🗑️ Delete</button>
      </div>
    </div>`;
}

function attachCardEvents() {
  // Delete
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this subscription?')) return;
      btn.textContent = 'Deleting…';
      btn.disabled = true;
      try {
        const res = await api.deleteSubscription(btn.dataset.id);
        if (res.success) loadSubscriptions();
        else alert(res.message || 'Failed to delete');
      } catch { alert('Error deleting.'); }
    });
  });

  // Edit — open modal
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = JSON.parse(btn.dataset.sub);
      openEditModal(s);
    });
  });
}

// ── Edit Modal ──
function openEditModal(s) {
  document.getElementById('edit-modal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'edit-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h2 class="modal-title">Edit Subscription</h2>
        <button class="modal-close" id="modal-close">✕</button>
      </div>
      <div id="modal-alert" class="alert"></div>
      <form id="edit-form">
        <div class="form-group">
          <label>Service name</label>
          <input type="text" id="e-name" value="${s.name}" required/>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Price</label>
            <input type="number" id="e-price" value="${s.price}" min="0" step="0.01" required/>
          </div>
          <div class="form-group">
            <label>Currency</label>
            <select id="e-currency">
              ${['USD','EUR','GBP','INR','AUD','CAD','JPY'].map(c =>
                `<option value="${c}" ${s.currency===c?'selected':''}>${c}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Frequency</label>
            <select id="e-frequency">
              ${['Monthly','Yearly','Weekly','Daily'].map(f =>
                `<option value="${f}" ${s.frequency===f?'selected':''}>${f}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select id="e-status">
              ${['Active','Expired','Cancelled'].map(st =>
                `<option value="${st}" ${s.status===st?'selected':''}>${st}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Payment method</label>
          <input type="text" id="e-payment" value="${s.paymentMethod}" required/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-cancel-modal" id="modal-cancel">Cancel</button>
          <button type="submit" class="btn-primary" id="edit-submit-btn" style="width:auto;padding:12px 28px">Save changes</button>
        </div>
      </form>
    </div>`;

  document.body.appendChild(modal);

  const close = () => modal.remove();
  document.getElementById('modal-close').addEventListener('click', close);
  document.getElementById('modal-cancel').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertEl = document.getElementById('modal-alert');
    const submitBtn = document.getElementById('edit-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving…';
    alertEl.className = 'alert';

    const data = {
      name:          document.getElementById('e-name').value.trim(),
      price:         parseFloat(document.getElementById('e-price').value),
      currency:      document.getElementById('e-currency').value,
      frequency:     document.getElementById('e-frequency').value,
      status:        document.getElementById('e-status').value,
      paymentMethod: document.getElementById('e-payment').value.trim(),
    };

    try {
      const res = await api.updateSubscription(s._id, data);
      if (res.success) {
        close();
        loadSubscriptions();
      } else {
        alertEl.textContent = res.message || 'Failed to update';
        alertEl.className = 'alert alert-error show';
      }
    } catch {
      alertEl.textContent = 'Connection error.';
      alertEl.className = 'alert alert-error show';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save changes';
    }
  });
}

loadSubscriptions();
