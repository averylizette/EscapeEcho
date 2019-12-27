const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const bodyparser = require('body-parser');
const loginFns = require('./routes/api/signin.js') 
const mongoose = require('mongoose');
const config = require('../config')

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(bodyparser.json());

mongoose.connect(config.db_dev);


app.listen(PORT, () => console.log('Listening on port: ' + PORT));