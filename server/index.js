const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const bodyparser = require('body-parser');

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(bodyparser.json());




app.listen(PORT, () => console.log('Listening on port: ' + PORT));