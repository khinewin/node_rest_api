const express=require('express')
const route=express.Router();
const mongoose=require('mongoose');
const multer=require('multer');

const jm = require('js-meter')
const jwt_auth=require('../middleware/Auth');







mongoose.connect('mongodb://localhost:27017/node3');
const Product=require('../model/products');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/products')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})

var upload = multer({ storage: storage })



route.put('/', (req, res, next)=>{
    let id=req.body.id;
    Product.findById(id).exec()
        .then(result=>{
            let product=Product.findById(id);
            product.update({$set : {name : req.body.name, price :req.body.price}})
                .then(doc=>{
                    res.status(200).json({
                        message: "The product update success."
                    })
                }).catch(errs=>{
                    res.json(errs)
            })
        })
        .catch(err=>{
            res.status(500).json({
                message : "The selected product was invalid.",
                error :err
            })
        })
});


route.delete('/:productId', (req, res, next)=>{
    const id=req.params.productId;
    Product.findById(id).exec()
        .then(result=>{
            let pd=Product.findById(id)
            pd.remove()
                .then(doc=>{
                    res.status(200).json({
                        message : "The selected product have been removed.",

                    })
                })
                .catch(errs=>{
                    res.status(500).json({
                        message : "Unknown Error.",
                        error : errs
                    })
                })
        })
        .catch(err=>{
            res.status(500).json({
                message : "The selected product was not found.",
                error : err,
            })
        })


});
route.get('/:productId', (req, res, next)=>{
    let id=req.params.productId;
    Product.findById(id).select("name price _id")
        .exec()
        .then(result=>{
            res.status(200).json({
                product : result,
                products : {
                    type : "GET",
                    url : "http://localhost:3000/products"
                }
            })
        })
        .catch(err=>{
            res.status(500).json({
                message : err
            })
        })
});
route.get('/', jwt_auth, (req, res, next)=>{
    Product.find().sort({_id: -1})
        .exec()
        .then(result=>{
            res.status(200).json({

                total : result.length,
                products : result.map(doc=> {
                    return {
                        _id :doc._id,
                        name :doc.name,
                        price :doc.price,
                        productImage :doc.productImage,
                        request : {
                            type : 'GET',
                            url : 'http://localhost:3000/products/' + doc._id,
                        },
                        remove : {
                            type : 'DELETE',
                            url : 'http://localhost:3000/products/' + doc._id
                        },
                        update : {
                            type :'PUT',
                            url :'http://localhost:3000/products',
                            data : "id, name , price",
                            dataTye : "JSON"
                        }
                    }
                }),
                new_product : {
                    type: 'POST',
                    url :'http://localhost:3000/products',
                    data : "name, price",
                    dataType : 'JSON'
                },

            })
        })
        .catch(err=>{
            res.status(500).json({
                message : err
            })
        })

});

route.post('/', upload.single('productImage'), (req, res, next)=>{

        let products={
            _id : new mongoose.Types.ObjectId,
            name : req.body.name,
            price :req.body.price,
            productImage :req.file.filename
        }
        let product=new Product(products);
        product.save()
            .then(result=> {
                res.status(200).json({
                    message : "Product have been saved.",
                    product : {
                        _id : result._id,
                        name :result.name,
                        price :result.price
                    }
                })
            })
            .catch(err=>{
                res.status(500).json({
                    message : err
                })
            })
});

module.exports=route;
