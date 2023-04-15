exports.buildHeader = (headers, dest_result, tokenConn) => {
    if(headers === undefined){
        headers = {
            "Proxy-Authorization": "Bearer " + tokenConn,
            Authorization: "Basic " + Buffer.from(dest_result.destinationConfiguration.User + ":" + dest_result.destinationConfiguration.Password).toString("base64"),
        };
        return headers
    }
}

exports.buildProxy = (connect_service) => {
    return {
        host: connect_service.connectivity.onpremise_proxy_host,
        port: connect_service.connectivity.onpremise_proxy_port,
    };
    
}