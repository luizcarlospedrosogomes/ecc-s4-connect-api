const axios = require("axios");
const logger = require('./logger');
const formUrlEncoded = (x) => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");

exports.getToken = async (url, clientid, clientsecret) => {
    console.log(url)
    try {
        const result = await axios({
            method: "post",
            url: `${url}/oauth/token`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
                Authorization:
                    "Basic " +
                    Buffer.from(clientid + ":" +clientsecret).toString("base64"),
            },
            data: formUrlEncoded({
                grant_type: "client_credentials",
                client_id: clientid,
            }),
        });
        return result.data.access_token;
    } catch (error) {
        console.error(`[ERROR] ${error.message}`);
       // throw Error(error.message)
       throw new Error(error)
    }
}