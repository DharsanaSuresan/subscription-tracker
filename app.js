import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.route.js';
import connectToDatabase from './Database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser())
///api/V1/auth/sing-up
app.use('/api/V1/auth',authRouter);
app.use('/api/V1/users',userRouter);
app.use('/api/V1/subscriptions',subscriptionRouter);

app.use(errorMiddleware);

app.get('/',(req,res)=>{
    res.send('Welcome to the Subscription Tracker API!');
})

app.listen(PORT,async()=>{
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
    await connectToDatabase();
});

export default app;