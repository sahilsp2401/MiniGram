const connectToMongo = require('./db');
const express = require('express');
const bodyParser = require('body-parser');

connectToMongo();

const app = express();
const port = 5000

var cors = require('cors');

app.use(bodyParser.json());
app.use(cors())  //use to handle cross origin request
app.use(express.json()) //to use req.body we need this

app.use('/api/auth',require('./routes/auth'));
app.use('/api/posts',require('./routes/posts'));

app.listen(port, () => {
  console.log(`Minigram backend app listening on port ${port}`)
})