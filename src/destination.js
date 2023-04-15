const axios = require("axios");
const xsenv = require('@sap/xsenv');

const token = require('./token');
const destination = require('./destination');
const util = require('./util');
const logger = require('./logger');


xsenv.loadEnv()

exports.getDestination = async (uri, destinationName, token) => {    
    try {
        var dest_result = await axios({
            method: "GET",
            url: uri + '/destination-configuration/v1/destinations/' + destinationName ,
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
        });

        return dest_result.data;
    } catch (error) {
        logger.error(`[ERROR] get destination ${destinationName} ${error.message}`);
        //throw new Error(error.message)
        throw new Error(error.message)
    }
}
exports.build_req_options = async (req, data, method= 'GET')=>{
    const { path } = req
    const destinationName  = req.headers['destination-name'];    
    const dest_service      = xsenv.getServices({ destination: { tag: "destination" } });
    const connect_service   = xsenv.getServices({ connectivity: { tag: "connectivity" } });
        
    const tokenDestination = await token.getToken(dest_service.destination.url, dest_service.destination.clientid, dest_service.destination.clientsecret)
    const dest_result      = await destination.getDestination(dest_service.destination.uri, destinationName, tokenDestination);
    const tokenConn        = await token.getToken(connect_service.connectivity.token_service_url,connect_service.connectivity.clientid , connect_service.connectivity.clientsecret)
    
    const proxy = util.buildProxy(connect_service);
    const headers = util.buildHeader(undefined, dest_result, tokenConn);
    
    var req_options = {
        method: method,
        url: dest_result.destinationConfiguration.URL + path,
        withCredentials: true,
        //params: 'params,
        headers,
        proxy
    };
    
    if(method === 'POST' || method === 'PUT'){
        req_options.data = data;
    }

    logger.info('req_options',req_options);    
    console.log(req_options)
    return req_options
}