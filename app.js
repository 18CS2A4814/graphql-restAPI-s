const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const path=require('path');
const multer=require('multer');
const {graphqlHTTP}=require("express-graphql");
const graphqlSchema=require('./graphql/schema');
const graphqlResolver=require("./graphql/resolver")
const auth=require('./middleware/auth');

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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
    if(req.method=== 'OPTIONS')
    {
      return res.sendStatus(200); //when using graphql as options is send before other method. graphql only allows get & post
    }
    next();
});

app.use(auth);

app.use('/graphql',graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql:true,
  customFormatErrorFn(err) {
    if(!err.originalError)
    {
      return err;
    }
    const data=err.originalError.data;
    const message=err.message || "An Error Occured";
    const code=err.originalError.code || 500;
    return { message:message, status:code, data:data};
  }
}));

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
  })
  .catch(err => console.log(err));