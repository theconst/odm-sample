/*
 * Server example for simple CRUD application for Cache Intersystems 
 */

const express = require('express');
const app = express();

app.use(express.json());


// logging
app.use((req, _, next) => {
    console.log(`${req.method}: ${req.originalUrl}`);

    next();
});

// CORS
app.use((_, res, next) => {
    
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/employee', require('./controllers/employee-router'));
app.use('/company', require('./controllers/company-router'));


// error handling
app.use((err, _1, res, _2) => {
    console.log(err);

    const status = err.status;
    if (status) {
        return res.status(status).json({
                'message': err.message,
                'code': null,
            });
    } else {
        const msg = err.message;
        const matches = msg && msg.match(/\[Native Code (\d+)\]/m);
        const code = matches && matches[1];
        return res.status(500)
            .json({
                'message': 'Internal Server Error',
                'code': code,
            });
    }
});

const port = 8080;
app.listen(port, () => console.log(`Stared server on port ${port}`));