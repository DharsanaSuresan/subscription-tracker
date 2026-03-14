import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.route.js';
import connectToDatabase from './Database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser())
// app.use(cors({
//   origin: ['https://your-netlify-url.netlify.app', 'http://localhost:3000'],
//   credentials: true
// }));
app.use(cors({
  origin: ['https://subscriptiontracker-api.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
///api/V1/auth/sing-up
app.use('/api/V1/auth',authRouter);
app.use('/api/V1/users',userRouter);
app.use('/api/V1/subscriptions',subscriptionRouter);

app.use(errorMiddleware);




app.get('/',(req,res)=>{
    res.send('Welcome to the Subscription Tracker API!');
})

// app.listen(PORT,async()=>{
//     console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
//     await connectToDatabase();
// });
app.listen(PORT || 3000, async () => {
    console.log(`Server running on port ${PORT || 3000}`);
    await connectToDatabase();
});

// Keep-alive ping (prevents Railway free tier sleep)
const SELF_URL = process.env.RAILWAY_PUBLIC_DOMAIN 
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/` 
  : null;

if (SELF_URL) {
  setInterval(async () => {
    try {
      await fetch(SELF_URL);
      console.log('Keep-alive ping sent');
    } catch (e) {
      console.error('Keep-alive ping failed:', e.message);
    }
  }, 14 * 60 * 1000); // every 14 minutes
}

export default app;
