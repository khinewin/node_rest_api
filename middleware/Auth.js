const jwt=require('jsonwebtoken');


let auth=(req, res, next)=>{

    if(req.headers.authorization){
        const headerToken=req.headers.authorization.split(" ")[1];
        jwt.verify(headerToken, "password", function (err, ok) {
            if(err){
                res.json({
                    message :err
                })
            }else{
                next();
            }
        })

    }else{
        res.status(422).json({
            message : "Token is required."
        })
    }
    
   /* if(req.headers.authorization){
        const headerToken=req.headers.authorization.split(" ")[1];
        const checkAuth=jwt.verify(headerToken, "password");
        if(checkAuth._id){
            next();
        }else{
            res.json(checkAuth)
        }

    }else{
        res.status(422).json({
            message : "Token is required."
        })
    }
    */



}

module.exports=auth;