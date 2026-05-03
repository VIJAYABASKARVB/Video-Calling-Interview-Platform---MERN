import {requireAuth} from '@clerk/express'
import User from "../models/user.model.js"

export const protectRoute = [

  // Step 1: Clerk checks authentication
  requireAuth(),

  async (req,res,next) => {
    try{

      // Step 2: Get user ID from Clerk
      const clerkId = req.auth().userId;

      // Step 3: Check if user ID exists
      if(!clerkId){
        return res.status(404).json({message:"Unauthoized - invalid token"})
      }

      // Step 4: Find user in your database
      const user = await User.findOne({clerkId});

      // Step 5: If user not found
      if(!user){
        return res.status(404).json({message:"User not found"});
      }

      // Step 6: Attach user to request
      req.user = user;

      next();

    }catch(error){
      console.error("Error in protectRoute middleware",error);
      res.status(500).json({message:"Internal server Error"});
    }
  }
]