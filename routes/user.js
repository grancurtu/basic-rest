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

function listUsers (req, res) {

  let selectSQL = "SELECT email,user.name,lastname,address,coalesce((SELECT sum(amount) FROM sale WHERE sale.userid=user.userid and sale.disabled=0),0) as sales_amount,userstate.name as userstate " +
                      " FROM user " +
                      " INNER JOIN userstate ON userstate.userstateid=user.userstateid";

  console.log('Rquesting users');
  db.all(selectSQL)
    .then((response) => {
      console.log('Success');
      res.status(200).send({rows:response});
    })
    .catch((err) =>{
      console.warn('Something went wrong',err.stack);
        res.status(500).send({ error: 'Service failed, please try again later' });
    });

}

function validateNewUser(user){
  let validation = validateField(user.name,'name',true);
  if(!validation.valid)
    return  validation;

  validation = validateField(user.lastname,'lastname',true);
  if(!validation.valid)
    return  validation;

  validation = validateField(user.email,'email',true,/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);
  if(!validation.valid)
    return validation;

  validation = validateField(user.address||'','address');
  if(!validation.valid)
    return  validation;

  return validation;
}

function createUser (req, res) {

  let insertSQL = "INSERT INTO USER (name,lastname,email,address) VALUES ('%s','%s','%s','%s')";

  console.log('New user request');
  let newUser = {
    name:'',
    lastname:'',
    email:'',
    address: ''
  };

  let validation = validateNewUser(req.body);
  if(!validation.valid){
    res.status(400).send({error:validation.msg})
  } else {
    for(const elem in newUser) {
      insertSQL =  util.format(insertSQL, req.body[elem]||newUser[elem]);
    }

    //everything is ok create
    console.log('Everything is ok, ready to create the user');
    return db.exec(insertSQL)
      .then((response) => {
        console.log('Success');
        res.status(200).send({msg:"User '"+req.body.email+"' has been registerd"});
      })
      .catch((err) =>{
        if(err.errno===19){
          res.status(400).send({ error: 'User already register'});
        }else{
          console.log('Something went wrong',err.stack);
          res.status(500).send({ error: 'Service failed, please try again later'});
        }

      });
  }

}

function approveUser (req, res)  {
  let updateQuery = "UPDATE user set userstateid=2 where email = '%s' and userstateid=1 ";

  validation = validateField(req.body.email,'email',true);
  if(!validation.valid){
    res.status(400).send({error:validation.msg})
  } else {
    updateQuery =  util.format(updateQuery, req.body.email);

    console.log('Everything is ok, update the user');
    return db.run(updateQuery)
      .then((response) => {
        if(response.changes !=0 || response.lastID!=0){
          //there was an update
          console.log('Success');
          res.status(200).send({msg:"The user '"+req.body.email+"' has been approved"});
        }else{
          //there wasn't an update
          console.log('Nothing change');
          res.status(200).send({msg:"The user '"+req.body.email+"' is not registered or is already approved"});
        }
      })
      .catch((err) =>{
        console.log('Something went wrong',err.stack);
        res.status(500).send({ error: 'Service failed try again later' })
      });
  }

}

function validateUserToUpdate(user){

  let validation = validateField(user.email,'email',true,/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);
  if(!validation.valid)
    return validation;

  validation = validateField(user.name,'name');
  if(!validation.valid)
    return  validation;

  validation = validateField(user.lastname,'lastname');
  if(!validation.valid)
    return  validation;


  validation = validateField(user.address||'','address');
  if(!validation.valid)
    return  validation;

  return validation;
}

function updateUser (req, res)  {
  let updateUser = "UPDATE user SET name=%s,lastname=%s,address=%s WHERE email=%s" ;

  console.log('New user request');
  let user = {
    name:'',
    lastname:'',
    address: ''
  };

  //primero validas el usuario
  let validation = validateUserToUpdate(req.body);
  if(!validation.valid){
    res.status(400).send({error: validation.msg})
  }else{
    //despues el mail

    for(const elem in user) {
      updateUser =  util.format(updateUser, req.body[elem] ? "'"+req.body[elem]+"'" : elem);
    }

    updateUser =  util.format(updateUser, "'"+req.body['email']+"'");

    //everything is ok create
    db.run(updateUser)
      .then((response) => {
        if(response.changes !=0 || response.lastID!=0){
          //there was an update
          console.log('Success');
          res.status(200).send({msg:"The data of the user '"+req.body.email+"' was successfully updated"});
        }else{
          //there wasn't an update
          console.log('Nothing change');
          res.status(200).send({msg:"The user '"+req.body.email+"' is not registered"});
        }
      })
      .catch((err) =>{
        console.log('Something went wrong',err.stack);
        //  FIXME handle error
        res.status(500).send({ error: 'Service fail try again later' })
      });

  }

}


function disableUser (req, res)  {

  let updateQuery = "UPDATE user set userstateid=3 where email = '%s' and userstateid<>3";

  validation = validateField(req.body.email,'email',true);
  if(!validation.valid){
    res.status(400).send({error:validation.msg})
  } else {
    updateQuery = util.format(updateQuery, req.body['email']);

    db.run(updateQuery)
      .then((response) => {
        if (response.changes != 0 || response.lastID != 0) {
          //there was an update
          console.log('Success');
          res.status(200).send({msg:"The user '" + req.body.email + "' has been disabled"});
        } else {
          //there wasn't an update
          console.log('Nothing change');
          res.status(200).send({msg:"The  user '" + req.body.email + "' is not registered or is already disabled"});
        }
      })
      .catch((err) => {
        console.log('Something went wrong', err.stack);
        //  FIXME handle error
        res.status(500).send({error: 'Service failed try again later'});
      });
  }
}

module.exports = {
  get: listUsers,
  post: createUser,
  put : updateUser,
  delete: disableUser,
  approve: approveUser
};