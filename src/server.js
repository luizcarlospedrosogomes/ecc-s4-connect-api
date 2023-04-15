const express = require('express');
const xsenv = require('@sap/xsenv');
const xssec = require('@sap/xssec');
const axios = require("axios");
const httpClient = require('@sap-cloud-sdk/http-client');
const connectivity = require('@sap-cloud-sdk/connectivity');
const url = require('url');

const destination = require('./destination');
const logger = require('./logger');

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

xsenv.loadEnv();

const passport = require('passport');
const xsuaa = xsenv.getServices({ xsuaa: { tag: 'xsuaa' } }).xsuaa;
passport.use(new xssec.JWTStrategy(xsuaa));

app.use('/direct',async (req, res, next) =>{    
    try {
        const req_options = await destination.build_req_options(req)        
        const result = await axios(req_options);        
        res.status(200).send(result.data);
        next()
    } catch (error) {
        logger.error(`[ERROR] ${error.message}`);        
        res.status(200).send(error);
    }
})

app.post('/token', async (req, res) =>{
    const { body } = req
    const { username, password } = body;
    
    if(username === undefined || password === undefined){
        throw new Error('crendentials not found in body')
    }
    try {
        const params = new url.URLSearchParams({ grant_type: 'password', username, password});               
        const basicAuth = 'Basic ' + Buffer.from( xsuaa.clientid + ':' + xsuaa.clientsecret).toString('base64');        
        const result = await axios.get(`${xsuaa.url}/oauth/token?${params.toString()}`, { headers: { Authorization: basicAuth }})        
        res.statusCode = 200;
        res.send(result.data.access_token)

    } catch (error) {       
        logger.error(error.message)
        res.statusCode = 400;
        res.send(error)
    }
    
});

app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }))

app.use(async (req, res, next) =>{    
    const jwt = connectivity.retrieveJwt(req);
    const destinationName  = req.headers['destination-name']; 
    const props = { url: req.path, data: req['data']}
    const options = { fetchCsrfToken: false };
    
    try {
        const result = await httpClient.executeHttpRequest(
            { destinationName,jwt},
            props,
            options
            
        );
        res.status(200).send(result.data);
        next()    
    } catch (error) {
        logger.error(`[ERROR] ${error.message}`);        
        res.status(200).send(error);
    }
    
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('myapp listening on port ' + port);
});