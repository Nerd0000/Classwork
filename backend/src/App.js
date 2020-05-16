const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());

app.all('/*', function(request, response, next) {
    response.header("Access-Control-Allow-Origin", process.env.REACT_APP_URL_FRONT);
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(routes);

module.exports = app;