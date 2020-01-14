const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoute = require('./routes/auth');
const boardRoute = require('./routes/board');

dotenv.config();

mongoose.connect(process.env.MONGODB_AUTH, {useNewUrlParser: true, useUnifiedTopology: true},() => console.log('Connected to MongoDB Cluster'));

app.use(express.json());
app.use(cors());
app.use('/api/users', authRoute);
app.use('/api/board', boardRoute);

app.listen(8080, () => console.log("Server is running."));