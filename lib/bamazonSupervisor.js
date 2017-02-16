var inquirer = require("inquirer");
var clear = require("clear");
require("console.table");

// lib
var Query = require("./queries/supervisorQueries");

module.exports = function(){
  Query.salesByDepartment().then((results)=>{
    console.table(results);
    Query.end();
  })
}