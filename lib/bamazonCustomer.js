var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require("figlet");
var clear = require("clear");
require("console.table");


// ================= SQL queries ======================
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'foo',
  password : 'bar',
  database : 'bamazon_db'
});


// ---------------------- Queries -----------------------------------
// gets all products and shows all info on products
var getProducts = function(){
  return new Promise(function(resolve, reject){
    // connection.connect();
    connection.query("SELECT * FROM product;", function(err, data, fields){
      if (err) reject(err);
      resolve(data);
      // connection.end();
    });
  }); // promise
}

// ---------------------- Queries -----------------------------------
// get the number of products for a given id
var getNumAvailable = function(id){
  return new Promise(function(resolve, reject){
    // connection.connect();
    connection.query("SELECT stock_quantity, product_name, id, price FROM product WHERE id = ?", [id], function(err, data){
     if (err) reject(err);
     resolve(data[0]);
    //  connection.end();
    }); 
  }); 
}; 

// ---------------------- Queries -----------------------------------
var processOrder = function(orderObj){
  return new Promise((resolve, reject)=>{
    var id = orderObj.id;
    var quantity = orderObj.quantity;
    connection.query("UPDATE product set stock_quantity = stock_quantity - ? WHERE id = ?;", [quantity, id], function(err, data){
      if (err) reject(err);
      connection.query("INSERT INTO sale (quantity_purchased, product_id) VALUES (?, ?);",[quantity, id], function(err, data){
        if (err) reject(err);
        resolve(data);
      })
      // resolve(data);
    });
  })
}
// TESTING
// processOrder({id:20, quantity: 5}).then((result)=>{
//   console.log(result);
// });

// ================= Inquirer ======================
/* askProductId()
* this method display all products from a query,
* then asks the user to enter an id
* and an amount
*/
var askProductId = function(){
  return new Promise((resolve, reject)=>{
    clear();
    console.log(figlet.textSync("Products"));
    // Show products
    getProducts().then(function(data){
      // 0. exit if no products
      if (data.length === 0){
        console.log("Sorry, there are no products");
        resolve({valid: false, msg: "No products!"});
      }
      // Show the table;
      console.table(data);

      // 1. convert data array --> array of product_name
      // var products = data.map(function(item){
      //   return item.product_name;
      // })
      var ids = data.map(function(item){
        return item.id;
      })
      // console.log(ids);

      // 2. inquirer, ask them for the id
      inquirer.prompt([
        {name: "id", message: "What product would you like to buy? (id)", type: "input"}
      ]).then(function(input){
        var id = parseInt(input.id);
        if (ids.indexOf(id) !== -1){
          // valid id
          // console.log("valid id");
          resolve({valid: true, id: id});
        } else {
          resolve({valid: false, msg:`Sorry id of '${id}' was not found in the products tables`});
        }
      })

    }, function(err){
      console.log(err);
      console.log("Error from getProdcuts promise!");
      reject({valid: false, msg: `${err.stack}`});
    })

  }) // promise
} // closes product id 
// testing


// Calls the ^ promise and returns yet another promise ...
var askProductNumber = function(id){
  return new Promise((resolve, reject)=>{
    // ask user for product id
    askProductId().then((dataObj)=>{
      if (!dataObj.valid) {
        reject( "NOT a valid id")
        return; // IF I DON'T have this I get a unhandled promise err
      };
      getNumAvailable(dataObj.id)
      .then((product)=>{
        // console.log(product.stock_quantity);
        var MAX = product.stock_quantity;
        var name = product.product_name;

        inquirer.prompt({
          type: "input", 
          message: `How many of "${name}"(s) would you like to purchase?`,
          name: "quantity",
          validate: function(val){
            if (val > MAX){
              return(`Sorry we only have ${MAX} of "${name}"`)
            }
            return true;
          }
        }).then((input)=>{
          // console.log(input.quantity);
          var order = {
            id: product.id,
            product_name: name,
            quantity: input.quantity,
            price: product.price,
          };
          resolve(order);
        })
      }, (err)=> {
        console.log(err);
        reject(err);
      })
    }) // closes askProdcutId() promise
  }) // promise
};

var checkOut = function(){
  return new Promise((resolve, reject)=>{
    askProductNumber().then((order)=> {
      // console.log(data);
      // connection.end();
      // 1.) ask user if they want to make the order
      var total = order.price * order.quantity;
      inquirer.prompt({
        type: "confirm",
        name: "proceed",
        message: `Do you want to purchase x${order.quantity} of "${order.product_name}" for a grand total of: $${total}`
      }, (err)=> {console.log(err)}).then((input)=>{
        // 2.) if yes, then process order
        // console.log(input);
        if (input.proceed){
          processOrder(order).then(()=>{
            // console.log("processed order");
            resolve("processed order");
          });
        } else {
          // console.log("Did not process order");
          resolve("Did not process order");
        }
      }) // closes inquirer promise
    }, (err)=> {
      console.log(err);
      connection.end();
    });
  }); // closes promise
}


module.exports = function(){
  checkOut().then((result)=>{
  console.log(result);
  connection.end();
  }, (err)=>{console.log(err)});
}
