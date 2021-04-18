const express = require('express');
const bodyParser = require('body-parser');
const app = express();


var fs = require('fs');

const port = 10000;

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies   
  extended: true
})); 

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/updateSwagger', 
  (req, res, next) => {
      if (!req.body || !req.body.fn || !req.body.content) {
        res.send({status:'failure', message : 'wrong post data!'});
      } else {
        fs.writeFile('/var/appData/' + req.body.fn, req.body.content, 'utf-8', (err) => {
            res.send((!err) ? {status:'success'} : {status:'failure', message : err.message});
          });
      }
  }
)
app.listen(port,  () => {
    var d = new Date(); // for now
    datetext = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    console.log(datetext + ' Start Easy listening at http://localhost' + port );
});
