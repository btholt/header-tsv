'use strict'

//Lets require/import the HTTP module
const http = require('http');
const UA = require('ua-parser-js')
const fs = require('fs')
const util = require('util')

//Lets define a port we want to listen to
const PORT=8888
let version = 0
const writeStream = fs.createWriteStream('./output.tsv')

//We need a function which handles requests and send response
function handleRequest(request, response){

    console.log('***********')
    const ua = new UA()

    var headers = request.rawHeaders.filter(function(item, idx){
        return idx % 2 === 0;
    });
    ua.setUA(request.headers['user-agent'])
    const result = ua.getResult()
    let string = 'browser: ' + result.browser.name + ' ' + result.browser.version + '\n'
    string += 'os: ' + result.os.name + ' ' + result.os.version + '\n'
    string += 'version: ' + version + '\n'
    string += 'device: ' + result.device.name + ' ' + result.device.version + '\n'
    string += 'headers: ' + JSON.stringify(headers,null,0)
    const tsv = version + '\t' + request.url + '\t' + result.browser.name + '\t' + result.browser.version + '\t' + result.os.name + '\t' + result.os.version + '\t' + result.device.name + '\t' + result.device.version + '\t' + JSON.stringify(headers,null,0) + '\n'
    writeStream.write(util.format(tsv))

    console.log(string)
    response.setHeader('content-type', 'text/html')
    response.end(string)
    version++

}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});