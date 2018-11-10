const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    console.log(`${req.method}: ${req.originalUrl}`);
    
    next();
})

app.use('/employee', require('./server/employee-router'));
app.use('/company', require('./server/company-router'));

const port = 8080;
app.listen(port, () => console.log(`Stared server on port ${port}`));