let http=require('http');
let port=process.env.PORT || 3000;
let app=require('./app');

let server=http.createServer(app);

server.listen(port, ()=> {
    console.log("Node server is running on port " + port);
})