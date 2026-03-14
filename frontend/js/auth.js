import { api } from './api.js';
import { initTheme } from './theme.js';

initTheme();

if (localStorage.getItem('token')) {
  window.location.href = 'dashboard.html';
}

let isLogin = true;

const titleEl    = document.getElementById('auth-title');
const subtitleEl = document.getElementById('auth-subtitle');
const nameGroup  = document.getElementById('name-group');
const submitBtn  = document.getElementById('submit-btn');
const alertEl    = document.getElementById('alert');

function showAlert(msg, type = 'error') {
  alertEl.textContent = msg;
  alertEl.className = `alert alert-${type} show`;
}

document.getElementById('toggle-link').addEventListener('click', (e) => {
  e.preventDefault();
  isLogin = !isLogin;
  alertEl.className = 'alert';
  if (isLogin) {
    titleEl.textContent = 'Welcome back';
    subtitleEl.textContent = 'Sign in to your account';
    nameGroup.style.display = 'none';
    submitBtn.textContent = 'Sign in';
    document.getElementById('toggle-text').innerHTML = `Don't have an account? <a href="#" id="toggle-link">Sign up</a>`;
  } else {
    titleEl.textContent = 'Create account';
    subtitleEl.textContent = 'Start tracking your subscriptions';
    nameGroup.style.display = 'block';
    submitBtn.textContent = 'Create account';
    document.getElementById('toggle-text').innerHTML = `Already have an account? <a href="#" id="toggle-link">Sign in</a>`;
  }
  document.getElementById('toggle-link').addEventListener('click', arguments.callee);
});

document.getElementById('auth-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  alertEl.className = 'alert';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Please wait…';

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const name     = document.getElementById('name')?.value.trim();

  try {
    const res = isLogin
      ? await api.signIn({ email, password })
      : await api.signUp({ name, email, password });

    if (res.status || res.success) {
      localStorage.setItem('token',    res.data.token);
      localStorage.setItem('userId',   res.data.user._id);
      localStorage.setItem('userName', res.data.user.name);
      window.location.href = 'dashboard.html';
    } else {
      showAlert(res.message || 'Something went wrong');
    }
  } catch {
    showAlert('Could not connect to server.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = isLogin ? 'Sign in' : 'Create account';
  }
});
