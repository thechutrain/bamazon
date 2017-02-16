var Query = require("./managerQueries");
var inquirer = require("inquirer");
var clear = require("clear");
require("console.table");

// =============== TESTING =============
// Query.viewAll().then((products)=>{
//   console.table(products);
// })

// Query.viewLow().then((products)=>{
//   console.table(products);
// })

// Query.newProduct({
//   product_name: "Best thing eva",
//   price: 9.99,
//   stock_quantity: 1,
//   department_id: 1
// });

// Query.restock(21, 10).then((rowChanged)=>{
//   console.log(rowChanged); // if false, could be that id doesn't exist
// })

// Query.close();

// =============== TESTING =============

