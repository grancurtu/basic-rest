const express = require('express');
const app = express();

//easy json body for the services
app.use(express.json());
app.use (function (error, req, res, next){
  //we have a bad request and will broke the service so inform the error
  if(error){
    res.sendStatus(400);
    return;
  }
  //the request is ok continue
  next();
});

//modules with 
const user = require('./routes/user.js');
const sale = require('./routes/sale.js');


//it's working
app.get('/', (req, res) =>res.send('Yes another rest API... oh HELLO!!!!'));


app.get('/user', user.get);
app.post('/user', user.post);
app.put('/user', user.put);
app.delete('/user', user.delete);
app.post('/approve', user.approve);

app.get('/sale', sale.get);
app.post('/sale', sale.post);
app.delete('/sale', sale.delete);


app.listen(3000, () => console.log('Services listening on port 3000!'));
