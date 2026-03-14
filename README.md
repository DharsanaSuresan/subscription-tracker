# SubTrack — Subscription Tracker

A full-stack subscription management app built with Node.js, Express, MongoDB and vanilla HTML/CSS/JS.

🔗 **Live Demo:** [subscriptiontracker-api.netlify.app](https://subscriptiontracker-api.netlify.app)

---

## Features

- JWT Authentication (sign up / sign in / sign out)
- Add subscriptions with name, price, currency, frequency, category
- Edit subscription details 
- Delete subscriptions
- Dashboard with total count, active count and monthly cost by currency
- Dark / Light mode toggle with persistence
- Fully responsive design

## Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT authentication
- bcryptjs password hashing
- Deployed on Railway

**Frontend**
- Vanilla HTML, CSS, JavaScript (ES Modules)
- Roboto Slab + DM Sans typography
- Deployed on Netlify

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/V1/auth/sign-up` | Register user | ❌ |
| POST | `/api/V1/auth/sign-in` | Login user | ❌ |
| GET | `/api/V1/subscriptions/users/:id` | Get user subscriptions | ✅ |
| POST | `/api/V1/subscriptions` | Create subscription | ✅ |
| PUT | `/api/V1/subscriptions/:id` | Update subscription | ✅ |
| DELETE | `/api/V1/subscriptions/:id` | Delete subscription | ✅ |

## Local Development

```bash
# Clone the repo
git clone https://github.com/DharsanaSuresan/subscription-tracker.git
cd subscription-tracker

# Install backend dependencies
cd backend  # if using backend folder, otherwise stay at root
npm install

# Create .env.development.local with:
# PORT=3000
# DB_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# JWT_EXPIRES_IN=1d
# NODE_ENV=development

npm run dev
```

Open `frontend/index.html` in your brows
Built by [Dharsana Suresan](https://github.com/DharsanaSuresan)
