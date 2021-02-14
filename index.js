const { urlencoded } = require('express');
const express = require('express');
const app = express();
const pageRoute = require('./routes/page');
const authRoute = require('./routes/auth');

app.use(express.json());
app.use(urlencoded({ extended: true }));

// app.use('/', pageRoute);
app.use('/auth', authRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log('running in '+ PORT);
});