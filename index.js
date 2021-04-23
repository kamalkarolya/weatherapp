const fs = require('fs');
const http = require('http');
var requests = require('requests');
const {apikey} = require('./essential');
 const dataread = fs.readFileSync("home.html", "utf-8");


 const replaceVal = (tempval , orgval) =>{
     let temperature = tempval.replace("{%tempval%}",(orgval.main.temp - 273).toFixed(2));
      temperature = temperature.replace("{%tempmax%}",(orgval.main.temp_max - 273).toFixed(2));
      temperature = temperature.replace("{%tempmin%}",(orgval.main.temp_min - 273).toFixed(2));
      temperature = temperature.replace("{%location%}",orgval.name);
      temperature = temperature.replace("{%country%}",orgval.sys.country);
      temperature = temperature.replace("{%tempstts%}",orgval.weather[0].main);
     return temperature;
 }
const server = http.createServer((req, res) => {

    if (req.url == "/") {
        requests(apikey )
            .on('data',  (chunk)=> {
                const objdata = JSON.parse(chunk);
                //   console.log(objdata);
                 const arrdata = [objdata];
                //  console.log(arrdata[0].main);
                const realtime = arrdata
                .map((val)=> replaceVal(dataread, val))
                .join("");
                 res.write(realtime);
                // console.log(realtime);
            })
            .on('end',  (err)=> {
                if (err) return console.log('connection closed due to errors', err);

               res.end();
            });
    }
    
});



server.listen(8000, "127.0.0.1");