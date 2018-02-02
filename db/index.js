const  sqlite3 = require('sqlite3').verbose();


module.exports = {
  exec: (text) => {
    return new Promise(
      function(resolve,reject){
        let db = new sqlite3.Database('rest_api');
        return  db.serialize(() => {
          db.exec(text,(err)=>{
            if(err)
              reject(err);
            else
              resolve();
          })
        });
        db.close();
      })
  },
  all: (text) => {
    return new Promise(
      function(resolve,reject){
        let db = new sqlite3.Database('rest_api');
        return  db.serialize(() => {
          db.all(text,(err,rows)=>{
            if(err)
              reject(err);
            else
              resolve(rows);
          });
          db.close();
        })
      })
  },
  run: (text) => {
    return new Promise(
      function(resolve,reject){
        let db = new sqlite3.Database('rest_api');
        return  db.serialize(() => {
          db.run(text,[],function(err){
            if(err){
              reject(err);
            } else {
              resolve({
                changes:this.changes,
                lastID: this.lastID
              });
            }
          });
          db.close();
        })
      })
  }
};

