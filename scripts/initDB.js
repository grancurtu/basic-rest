const db = require('./../db/index.js');

const sql_createUser = "CREATE TABLE IF NOT EXISTS user" +
  "(" +
  "  userid INTEGER PRIMARY KEY ASC," +
  "  name VARCHAR(255) NOT NULL," +
  "  lastname VARCHAR(255) NOT NULL," +
  "  address VARCHAR(255)," +
  "  email VARCHAR(255) NOT NULL UNIQUE," +
  "  userstateid INTEGER NOT NULL DEFAULT 1"+
  "); ";

const sql_createUserState = "CREATE TABLE IF NOT EXISTS userstate" +
  "(" +
  "  userstateid INTEGER PRIMARY KEY ASC," +
  "  name VARCHAR(255) NOT NULL" +
  "); ";

const sql_insertUserState = "INSERT INTO userstate (name) values ('created');" +
                            "INSERT INTO userstate (name) values ('active');" +
                            "INSERT INTO userstate (name) values ('disabled');";

const sql_createSale = "CREATE TABLE IF NOT EXISTS sale" +
  "(" +
  "  saleid INTEGER PRIMARY KEY ASC," +
  "  userid INTEGER NOT NULL," +
  "  uuid VARCHAR(255) NOT NULL UNIQUE," +
  "  amount FLOAT NOT NULL," +
  "  date DATETIME DEFAULT (datetime('now'))," +
  "  disabled BOOLEAN DEFAULT (0)" +
  "); ";

/*const sql_createSaleState = "CREATE TABLE IF NOT EXISTS salestate" +
  "(" +
  "  userstateid INTEGER PRIMARY KEY ASC," +
  "  name VARCHAR(255) NOT NULL" +
  "); ";

const sql_insertSaleState = "INSERT INTO salestate (name) values ('active');" +
                            "INSERT INTO salestate (name) values ('canceled');";*/

console.log('Starting the DB initialization')
db.exec(sql_createUser+sql_createUserState+sql_createSale+sql_insertUserState)
  .then(console.log('The initilization ended successfully'))
  .catch((err) =>{
    console.log('Something went wrong')
    console.log(err)
  });

