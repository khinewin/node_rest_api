const mongoose=require('mongoose');

let productSchema=mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type: String, required: true},
    price : {type :Number, require: true},
    productImage : {type : String}

})

module.exports=mongoose.model("Product", productSchema);