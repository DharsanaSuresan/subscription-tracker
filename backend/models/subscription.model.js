import mongoose from "mongoose";
const subscriptionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Subscription name is required"],
        trim:true,
        minLength:2,
        maxLength:100
    },
    price :{
        type:Number,
        required:[true,"Subscription price is required"],
        min:[0,'Price must be greater than 0']
    },
    currency:{
        type:String,
        enum:['USD','EUR','GBP','INR','JPY','AUD','CAD',"RUPPES"],
    },
    frequency:{
        type:String,
        enum:['Monthly','Yearly','Weekly','Daily'],
    },
    category:{
        type:String,
        enum:['Entertainment','Productivity','Education','Health','Finance','Other'],
        required:[true,"Category is required"]
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true,

    },
    status:{
        type:String,
        enum:['Active','Expired','Cancelled'],
        default:'Active'
    },
    startDate:{
        type:Date,
        required:[true,"Start date is required"],
        validate:{
            validator:function(value){
                return value <= new Date();
            },
            message:"Start date cannot be in the future"
        } 
    },
    renewalDate:{
        type:Date,
        validate:{
            validator:function(value){
                return value >= this.startDate;
            },
            message:"Renewal date must be after the start date"
        } 
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true,
    }

},{timestamps:true});

subscriptionSchema.pre('save',function(next){
    if(!this.renewalDate){
        const renewalPeriods={
            Daily:1,
            Weekly:7,
            Monthly:30,
            Yearly:365,
        };
        this.renewalDate=new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate()+renewalPeriods[this.frequency]);
    }

    if(this.renewalDate < new Date()){
        this.status ='Expired';
    }
});

const Subscription=mongoose.model("Subscription",subscriptionSchema);

export default Subscription;