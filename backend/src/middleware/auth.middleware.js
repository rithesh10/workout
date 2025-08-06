import { asyncHandler } from "../asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.model.js";
export const verifyJWT=asyncHandler( async (req,res,next)=>{
    try{
        const authHeader = req.header("Authorization");
        // Only extract token from Authorization header, not cookies
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        // console.log("Authorization header:", authHeader);
        // console.log("Extracted token:", token);
            if(!token)
            {
                throw new ApiError(401,"unauthorized request");
            }
            const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
            if(!decodedToken)
            {
                throw new ApiError(404,"token does not match");
            }
            const user=await User.findById(decodedToken._id).select("-password -refreshToken");
            if(!user)
            {
                throw new ApiError(404,"user not found");
            }
            req.user=user;
            // console.log(user);
            next();

    }
    catch(err)
    {
       next(new ApiError(401,err?.message||"Invalid access token"))
    }

})
export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      const token = req.cookies?.accessToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);
  
      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }
  
      // Verify the token
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (!decodedToken) {
        throw new ApiError(404, "Token does not match");
      }
  
      // Find the admin associated with the token
      const admin = await Admin.findById(decodedToken._id).select("-password -refreshToken");
      if (!admin) {
        throw new ApiError(404, "Admin not found");
      }
  
      // Attach admin information to the request object
      req.admin = admin;
      next();
    } catch (err) {
      next(new ApiError(401, err?.message || "Invalid access token"));
    }
  });