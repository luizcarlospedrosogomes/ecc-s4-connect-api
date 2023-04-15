const express = require('express');
const destination = require('./destination');
const axios = require("axios");
const app = express();

app.use(async (req, res, next) =>{    
    try {
        const req_options = await destination.build_req_options(req)        
        const result = await axios(req_options);        
        res.status(200).send(result.data);
        next()
    } catch (error) {
        console.error(`[ERROR] ${error.message}`);        
        res.status(200).send(error);
    }
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('myapp listening on port ' + port);
});