var mysql = require("mysql");

// ================= Setting up SQL connection ======================
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'foo',
  password : 'bar',
  database : 'bamazon_db'
});


// ================= Queries=========================
/*1) view products for sale - viewAll
* 2) view products with inventory less than 5
* 3) add product to inventory - restock
* 4) Add new product
*/

exports.viewAll = function(){
  return new Promise((resolve, reject)=>{
     connection.query("SELECT * FROM product;", function(err, data, fields){
       if (err) reject (`Error from queries.js: ${err.stack}`);
       resolve(data);
     });
  })
}

exports.viewLow = function(){
  return new Promise((resolve, reject)=>{
     connection.query("SELECT * FROM product WHERE stock_quantity <= 10;", function(err, data, fields){
       if (err) reject (`Error from queries.js: ${err.stack}`);
       resolve(data);
     });
  })
}

exports.restock = function(id, quantity){
  return new Promise((resolve, reject)=>{
     connection.query("UPDATE product set stock_quantity = stock_quantity + ? WHERE id = ?;", [quantity, id], function(err, results, fields){
       if (err) reject (`Error from queries.js: ${err.stack}`);
       resolve(results.affectedRows == 1);
     });
  })
}

// productObj = {product_name, department_id, price, stock_quantity}
exports.newProduct = function(p){
   return new Promise((resolve, reject)=>{
     connection.query("INSERT INTO product (product_name, department_id, price, stock_quantity) VALUES (?, ?, ?, ?)", 
     [p.product_name, p.department_id, p.price, p.stock_quantity], function(err, results, fields){
        if (err) reject(err);
        resolve(results);
    })
  })
};

// ================= Helper functions ============
// NEED to wrap in a promise!
// function departmentExists(id){
//     connection.query("SELECT id, department_name FROM department;", function(err, results, fields){
//       var validIds = results.map(function(department){
//         return department.id;
//       })
//       console.log(validIds);
//       return (validIds.indexOf(id) !== -1) ? true : false;
//     });
// }; // closes funct

exports.close = function(){
  connection.end();
}