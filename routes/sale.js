const db = require('../db/index.js');
const util = require('util');

function validateField(field,name,required,extra){
  const invalidReg = /\s*'\s*/;

  if(required && (!field || field.toString().trim()==='')){
    return {valid: false, msg:"The field '"+name+"' is mandatory"};
  }

  if(typeof field!='string' || invalidReg.test(field)||(extra && !extra.test(field))){
    return {valid: false, msg:"The field '"+name+"' is not valid"};
  }

  return {valid: true, msg:''};

}

function validateNumber(field,name,required,extra){
  const invalidReg = /\s*'\s*/;

  if(Number.isNaN(field) || field <= 0){
    return {valid: false, msg:"The mandatory field '"+name+"' is not valid"};
  }

  return {valid: true, msg:''};

}

function validateDate(field,name,required,extra){
  const invalidReg = /\s*'\s*/;

  if( typeof field !='string'  || field.trim()==='' || isNaN(Date.parse(field)) || invalidReg.test(field))
    return {valid: false, msg:"The mandatory field '"+name+"' is not valid"};

  return {valid: true, msg:''};

}

function listSales (req, res) {

  let selectQuery = "SELECT sale.uuid,sale.amount,sale.date,sale.disabled,user.email FROM sale INNER JOIN user ON user.userid=sale.userid WHERE user.email='%s'";

  validation = validateField(req.query.email,'email',true);
  if(!validation.valid){
    res.status(400).send({error:validation.msg})
  } else {
    selectQuery = util.format(selectQuery, req.query.email);

    console.log('List sales');

    db.all(selectQuery)
      .then((response) => {
        console.log('Success');
        res.send({rows: response});
      })
      .catch((err) => {
        console.log('Something went wrong', err.stack);
        //  FIXME handle error
        res.status(500).send({error: 'Service fail try again later'})
      });
  }
}

function validateNewSale(sale){
  let validation = validateField(sale.uuid,'uuid',true);
  if(!validation.valid)
    return  validation;

  validation = validateNumber(sale.amount,'amount',true);
  if(!validation.valid)
    return  validation;

  validation = validateDate(sale.date,'date',true);
  if(!validation.valid)
    return  validation;


  validation = validateField(sale.email,'email',true,/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);
  if(!validation.valid)
    return validation;

  return validation;
}

function createSale  (req, res){

  let selectQuery = "SELECT * FROM user where email = '%s'";

  let insertSQL = "INSERT INTO sale (uuid,amount,date,userid) VALUES ('%s',%d,'%s',%d)";


  console.log('New sale request');
  let newSale = {
    uuid:'',
    amount: 0,
    date: new Date()
  };

  let validation = validateNewSale(req.body);
  if(!validation.valid){
    res.status(400).send({error:validation.msg})
  } else {
    //TODO do not use a loop do it simple
    for (const elem in newSale) {
      insertSQL = util.format(insertSQL, req.body[elem]||newSale[elem]);
    }

    selectQuery = util.format(selectQuery, req.body.email);
    //everything is ok create
    db.all(selectQuery)
      .then(function (result) {
        if (result.length < 1) {
          throw {error: 404};
        } else {
          insertSQL = util.format(insertSQL, result[0].userid);
          return db.run(insertSQL);
        }
      })
      .then((response) => {
        console.log('Success');
        res.status(200).send({msg:'Sale uuid:'+req.body.uuid+' regiestered'});
      })
      .catch((err) => {
        //  FIXME handle error
        if (err.error && err.error === 404) {
          newSale['email'] = req.body.email;
          res.status(404).send({error: "The user '"+req.body.email+"' is not registered"});
        } else if(err.errno===19){
          res.status(400).send({ error: 'Sale already register'});
        }else{
          console.log('Something went wrong', err.stack);
          res.status(500).send({error: 'Service fail try again later'});
        }
      });
  }

}

function cancelSale (req, res) {

  let updateQuery = "UPDATE sale SET disabled=1 WHERE uuid= '%s' and disabled=0";

  validation = validateField(req.body.uuid,'uuid',true);
  if(!validation.valid){
    res.status(400).send({error:validation.msg})
  }else {
    //FIXME do validations
    updateQuery = util.format(updateQuery, req.body.uuid);

    db.run(updateQuery)
      .then((response) => {
        if (response.changes != 0 || response.lastID != 0) {
          //there was an update
          console.log('Success');
          res.status(200).send({msg:'The sale uuid:' + req.body.uuid + ' was canceled'});
        } else {
          //there wasn't an update
          console.log('Nothing change');
          res.status(200).send({msg:'The sale uuid:' + req.body.uuid + ' is not registered or is already canceled'});
        }
      })
      .catch((err) => {
        console.log('Something went wrong', err.stack);
        res.status(500).send({error: 'Service fail try again later'})
      });

  }
}

module.exports = {
  get: listSales,
  post: createSale,
  delete: cancelSale
}