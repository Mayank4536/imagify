import userModel from "../models/userModels.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js";

//Route for User Register
const registerUser = async (req,res) => {
    try {
        const {name, email, password} = req.body 

        if (!name || !email || !password) {
            return res.json({success:false, message:'Missing Details'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password:hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET)

        res.json({success:true, token, user:{name: user.name}})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

//Route for User login
const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success:false, message:'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res.json({success:true, token, user:{name:user.name}})
        } else{
             res.json({success:false, message:'Invalid credentials'})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error})
    }
}


//Controllers function for UserCredits
const userCredits = async (req,res) => {
    try {
        const  {userId} = req.body // We provide the UserId in the middleWare after completing the function. we create a new file in middleware i.e, auth.js

        const user = await userModel.findById(userId)
        res.json({success:true, credits: user.creditBalance, user:{name:user.name}})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error})
    }
}

//Here We setup a Razorpay payment gateway method
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const paymentRazorpay = async (req,res) => {
    try {

        const {userId, planId} = req.body

        const userData = await userModel.findById(userId)

        if (!userId || !planId) {
            return res.json({success: false, message: 'Missing Details'})
        }

        let credits, plan, amount, date

        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;

            case 'Advanced':    
                 plan = 'Advanced'
                 credits = 500
                 amount = 50
                 break;

            case 'Business':
                plan = 'Business' 
                credits = 5000
                amount = 250 
                break;   
            default:
                return res.json({success: false, message: 'Plan not found'})
        }

        date = Date.now()

        //Here We Create a function to stored all Transaction data
        //Stored the transaction data in MongoDb Database || create a new file transactionModel.js
         const transactionData = {
            userId, plan, amount, credits, date
         }

         const newTransaction = await transactionModel.create(transactionData)

         const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id
         }

         await razorpayInstance.orders.create(options, (error, order)=>{
            if (error) {
                console.log(error);
                return res.json({ success:false, message:error})
            }
            res.json({success:true, order})
         })
        
    } catch (error) {
       console.log(error);
        res.json({success: false, message: error.message})
    }
}

//Create a function to verify the Razorpay
const verifyRazorpay = async (req,res) => {
    try {

        const {razorpay_order_id} = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt)
            if (transactionData.payment) {
                return res.json({success:false, message:'Payment Failed'})
            }
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

export {registerUser, loginUser, userCredits, paymentRazorpay}


//After completing the successfully API for login and register
//Next we create the API for the User Credits
//After that we create the authenticaton function in middlewares folders i.e, auth.js
//Next we create the API to generate the image using prompt || Controllers folder -> imageControllers.js file
//After that we combined the backend and frontend folder
//Then Setup a Razorpay payment gateway method

