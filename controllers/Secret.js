const Secret=require('../models/secret')

exports.secretMess=async(req,res)=>{
    try{
        const {name,message}=req.body;
    
        if(!name||!message){
            return res.status(400).json({
                success: false,
                message: "Fill in the required details",
              });
        }

        await Secret.create({
            name,
            message
        })

        return res.status(200).json({
            success:true,
            message:"Message created successfully"
        })


    }catch(error){
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
    }
}


exports.getAllMessage= async (req,res)=>{
    try{

        const allMess=await Secret.find().select('-name').sort({ createdAt: -1 });

        return res.status(200).json({
            success:true,
            message:allMess
        })

    }catch(error){
        console.error(error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
}