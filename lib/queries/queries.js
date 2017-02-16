var mysql = require("mysql");
// var inquirer = require("inquirer");
// var figlet = require("figlet");
// var clear = require("clear");
// require("console.table");

// ================= Setting up SQL connection ======================
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'foo',
  password : 'bar',
  database : 'bamazon_db'
});


// ================= Queries=========================

exports.getAllProducts = function(){
  return new Promise((resolve, reject)=>{
     connection.query("SELECT * FROM product;", function(err, data, fields){
       if (err) reject (`Error from queries.js: ${err.stack}`);
       resolve(data);
     });
  }); // closes promise
};

/* --------------- checkProduct(id) ---------------
* @parama id {number} - primary key of product
* @resolve product {object} - object containing, stock_quantity, product_name, id, price 
*/
exports.checkProduct = function(id){
  return new Promise(function(resolve, reject){
    connection.query("SELECT stock_quantity, product_name, id, price FROM product WHERE id = ?", [id], function(err, data){
     if (err) reject(err);
     resolve(data[0]); // check that data is undefined!
    }); 
  }); 
};

/* --------------- processOrder({}) ---------------
*
*/
exports.processOrder = function(orderObj){
  return new Promise((resolve, reject)=>{
    var id = orderObj.id;
    var quantity = orderObj.quantity;
    connection.query("UPDATE product set stock_quantity = stock_quantity - ? WHERE id = ?;", [quantity, id], function(err, data){
      if (err) reject(err);
      resolve(data);
    });
  })
}


// ================= Helper functions ============
exports.close = function(){
  connection.end();
}