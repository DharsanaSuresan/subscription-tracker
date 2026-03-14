// import {Router} from 'express';
// import authorize from '../middlewares/auth.middleware.js';
// import { createSubscription ,getUserSubscriptions} from '../controllers/subscription.controller.js';
// const subscriptionRouter =Router();


// subscriptionRouter.get('/users/:id',authorize,getUserSubscriptions);

// subscriptionRouter.post('/',authorize,createSubscription) 

// subscriptionRouter.put('/',(req,res)=>{
//     res.send({title:'Update Subscription'});
// }) 

// subscriptionRouter.get('/',(req,res)=>{
//     res.send({title:'GET all Subscriptions'});
// })

// subscriptionRouter.delete('/',(req,res)=>{
//     res.send({title:'Delete Subscriptions'});
// })

// subscriptionRouter.delete('/user/:id',(req,res)=>{
//     res.send({title:'Get all user Subscriptions'});
// })

// subscriptionRouter.put('/:id/cancel',(req,res)=>{
//     res.send({title:'Cancel all Subscriptions'});
// })

// subscriptionRouter.get('/upcoming-renewals',(req,res)=>{
//     res.send({title:'Get all upcoming renewals'});
// })


// export default subscriptionRouter;
import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscriptions, updateSubscription, deleteSubscription } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/upcoming-renewals', authorize, (req, res) => {
    res.send({title: 'Get all upcoming renewals'});
});

subscriptionRouter.get('/users/:id', authorize, getUserSubscriptions);
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', authorize, updateSubscription);
subscriptionRouter.delete('/:id', authorize, deleteSubscription);

subscriptionRouter.put('/:id/cancel', authorize, async(req, res, next) => {
    req.body = { status: 'Cancelled' };
    next();
}, updateSubscription);

export default subscriptionRouter;