const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const database=require('./config/database')

database.connect()

const authRoutes = require('./routes/user'); 
const messRoutes = require('./routes/secret')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(
  {
    origin:"https://secret-mess-frontend.vercel.app",
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  }
));
app.options("*", cors());

// Set credentials in the response headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});



// Use user routes
app.use('/auth', authRoutes);
app.use('/secretMessage', messRoutes);




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
