import Subscription from '../models/subscription.model.js';
export const createSubscription = async(req, res, next) => {
    try{
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id});
        res.status(201).json({
            success: true,
            data: subscription
        });
        
    }
    catch(error){
        next(error);
    }
}

export const getUserSubscriptions = async(req, res, next) => {
    try{
        if(req.user._id.toString()!==req.params.id){
            const error = new Error("You are not authorized to view these subscriptions");
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({user: req.params.id});    
        res.status(200).json({
            success: true,
            data: subscriptions
        });
    }
    catch(error){
        next(error);
    }
}

export const updateSubscription = async(req, res, next) => {
    try{
        const subscription = await Subscription.findById(req.params.id);
        if(!subscription){
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }
        if(subscription.user.toString() !== req.user._id.toString()){
            const error = new Error("Not authorized");
            error.statusCode = 401;
            throw error;
        }
        const updated = await Subscription.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: updated });
    }
    catch(error){ next(error); }
}

export const deleteSubscription = async(req, res, next) => {
    try{
        const subscription = await Subscription.findById(req.params.id);
        if(!subscription){
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }
        if(subscription.user.toString() !== req.user._id.toString()){
            const error = new Error("Not authorized");
            error.statusCode = 401;
            throw error;
        }
        await Subscription.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Subscription deleted" });
    }
    catch(error){ next(error); }
}