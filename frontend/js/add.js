import { api } from './api.js';
import { initTheme } from './theme.js';

initTheme();

if (!localStorage.getItem('token')) window.location.href = 'index.html';

document.getElementById('nav-name').textContent = localStorage.getItem('userName') || 'User';
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});

const alertEl   = document.getElementById('alert');
const submitBtn = document.getElementById('submit-btn');

function showAlert(msg, type = 'error') {
  alertEl.textContent = msg;
  alertEl.className = `alert alert-${type} show`;
}

document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  alertEl.className = 'alert';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving…';

  const data = {
    name:          document.getElementById('name').value.trim(),
    price:         parseFloat(document.getElementById('price').value),
    currency:      document.getElementById('currency').value,
    frequency:     document.getElementById('frequency').value,
    category:      document.getElementById('category').value,
    paymentMethod: document.getElementById('paymentMethod').value.trim(),
    startDate:     document.getElementById('startDate').value,
  };

  try {
    const res = await api.createSubscription(data);
    if (res.success) {
      showAlert('Subscription added!', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1200);
    } else {
      showAlert(res.message || 'Failed to add subscription');
    }
  } catch {
    showAlert('Connection error. Try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add subscription';
  }
});
