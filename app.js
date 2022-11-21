const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const path=require('path');
const multer=require('multer');

const fileStorage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'images');
  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname);
  }
});

const fileFilter=(req,file,cb)=>{
  if(file.mimetype==='image/jpg'||file.mimetype==='image/jpeg'||file.mimetype==='image/png')
  {
    cb(null,true);
  }
  else
  {
    cb(null,false);
  }
}
app.use(bodyParser.json());
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));
app.use('/images',express.static(path.join(__dirname,'images')));

app.use((req,res,next)=>{
    // res.setHeader("Access-Control-Allow-Origin","*");
    // res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE");
    // res.setHeader("Access-Control-Allow-Headers","Authorization,Content-Type");
    // next();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
    next();
});

app.use('/feed',require('./routers/feed'));
app.use('/auth',require('./routers/auth'));

app.use((error,req,res,next)=>{
  console.log(error)
  const status=error.statusCode || 500;
  const message=error.message;
  res.status(+status).json({message:message});
})
mongoose
  .connect(
    'mongodb+srv://arvinchetry99:bharat@cluster0.z0rzwg9.mongodb.net/messageApp?retryWrites=true&w=majority'
  )
  .then(result => {
    const server=app.listen(8080);
    const io=require('socket.io')(server);
    io.on('connection',socket=>{
      console.log("Client Connected");
    })
  })
  .catch(err => console.log(err));