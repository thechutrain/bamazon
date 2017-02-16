var inquirer = require("inquirer");
var clear = require("clear");
require("console.table");

// lib
var Query = require("./lib/supervisorQueries");

Query.salesByDepartment().then((results)=>{
  console.table(results);
  Query.end();
})
// Query.close();