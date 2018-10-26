const express=require('express');
const Order=require('../model/orders');
const route=express.Router();
const mongoose=require('mongoose');
const Product=require('../model/products');

route.get('/', (req, res, next)=>{
       Order.find().populate("product", "_id name price").exec()
           .then(doc=>{
               res.json({
                   count : doc.length,
                   orders : doc.map(od=>{
                       return {
                           _id :od._id,
                           product : od.product,
                           qty :od.qty
                       }
                   })
               })
           })
           .catch(err=>{
               res.json(err)
           })
});

route.post('/' , (req, res,next)=>{
    let orders={
        _id : new mongoose.Types.ObjectId,
        product : req.body.productId,
        qty :req.body.qty
    }
    Product.findById(req.body.productId).exec()

        .then(()=>{
            let order=new Order(orders);
            order.save()
                .then(result=>{
                    res.json({
                        message :result
                    })
                })
                .catch(err=>{
                    res.json(err)
                })
        })
        .catch(err=>{
            res.json({
                message : "product invalid"
            })
        })
});

module.exports=route;