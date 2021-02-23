const dotenv = require('dotenv');
const express = require('express');
const exhbs = require('express-handlebars');
const app = express();
const pageRoute = require('./routes/page');
const authRoute = require('./routes/auth').router;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', exhbs());
app.set('view engine', 'handlebars');
// app.set('/css', require('./styles'));

app.use('/', pageRoute);
app.use('/', authRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log('running in '+ PORT);
});