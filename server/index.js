const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const bodyparser = require('body-parser');

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.render()
})


app.listen(PORT, () => console.log('Listening on port: ' + PORT));