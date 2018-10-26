let express=require('express')

let app=express();
let products=require('./route/products');
let morgan=require('morgan');
let bodyParser=require('body-parser');
let orders=require('./route/orders');
const users=require('./route/users');



app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended :true}));
app.use(bodyParser.json())

app.use('/productImages', express.static('files/products'));

app.use('/products', products);
app.use('/orders', orders);
app.use('/users', users);

app.use((req, res, next)=>{
    let error=new Error("Request not found.");
    error.status=404;
    next(error);
})
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        message : error.message,
        code : error.status
    })

});

module.exports=app;