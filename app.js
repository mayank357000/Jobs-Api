require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const authenticateUser=require('../starter/middleware/authentication');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');




//connectDB
const connectDB=require('./db/connect')
//routers
const authRouter=require('./routes/auth');
const jobsRouter=require('./routes/jobs');

//apn ne thunderclient mai automation daal di ki
//jaise hi login ya register we change a env variable val
//named accesstoken ,uske andr token val
//aur autherization header of others main wo Bearer {{accessToken}}
//use kiya , setup dekh aur automate postman video ke comments padh to set
//up in new project


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
app.set("trust proxy", 1);//ye bhi rate limiter ke docs se, deployment with reverse proxy like heroku and ngnix we should add this code
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());


// routes
app.use('/api/v1/auth',authRouter);
app.use("/api/v1/jobs",authenticateUser,jobsRouter);//middleware added to all routes starting with this



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
