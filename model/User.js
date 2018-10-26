const mongoose=require('mongoose');

let userSchema=mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type: String, required: [true, 'Name field is required']},
    email : {type :String , required :[true, "Email address field is required."],  match : [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "The email address is invalid."] },
    password : {type :String, required:true}



})

module.exports=mongoose.model("User", userSchema);