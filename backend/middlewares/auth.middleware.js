
import jwt from "jsonwebtoken"

export const authMiddleware = async(req , res , next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token not found"
            })
        }

        try{
            const decode =  jwt.verify(token,process.env.JWT_SECRET)
            req.user = decode;
            next();
        }
        catch(error){
            return res.status(403).json({
                success:false,
                message:"Invalid token"
            })
        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message || "Error in middlware"
        })
    }
}