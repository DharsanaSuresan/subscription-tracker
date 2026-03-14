// ⚠️ Replace this with your actual Railway URL
const BASE_URL = 'https://subscription-tracker-production-8fc0.up.railway.app';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const api = {
  // Auth
  signUp: (data) =>
    fetch(`${BASE_URL}/api/V1/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  signIn: (data) =>
    fetch(`${BASE_URL}/api/V1/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // Subscriptions
  getSubscriptions: (userId) =>
    fetch(`${BASE_URL}/api/V1/subscriptions/users/${userId}`, {
      headers: headers()
    }).then(r => r.json()),

  createSubscription: (data) =>
    fetch(`${BASE_URL}/api/V1/subscriptions`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // Users
  getUser: (userId) =>
    fetch(`${BASE_URL}/api/V1/users/${userId}`, {
      headers: headers()
    }).then(r => r.json()),
};
