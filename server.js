require('dotenv').config()


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const { connectDB } = require('./lib/db');
const {connectRedis} = require("./lib/redis")



const PORT = process.env.PORT || 5000;

// external routes
const router = require("./routes")
const { globalErrorHandler } = require('./middleware/errorHandler');

const app = express();




connectDB();
connectRedis();


app.use(cors(
  {
    origin: ["http://localhost:3000"],
    credentials: true
  }
))

  .use(express.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(router)
  .use(globalErrorHandler)












app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
