
import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const getUserDetails = async(req , res )=>{
    try{
        const id = req.user.id;
        if(!id) {
            return res.status(404).json({
                success:false,
                message:"User id not found"
            })
        }
        const userDetails = await prisma.user.findUnique({where:{id}})
        return res.status(200).json({
            success:true,
            message:"Agent details fetched successfully",
            userDetails
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message || "Server error"
        })
    }
}