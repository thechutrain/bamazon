var inquirer = require("inquirer");
var clear = require("clear");
require("console.table");

// lib
var Query = require("./queries/managerQueries");

module.exports = function(){
  inquirer.prompt([
    {
      name: "choice",
      message: "Choice an option: ",
      type: "list",
      choices: [
        "1) List all products",
        "2) View low stock items",
        "3) Restock a product",
        "4) Add a new product"
      ]
    }
  ]).then((input)=>{
    var choice = parseInt(input.choice.charAt(0));
    // console.log(choice);
    clear();
    switch(choice){
      case 1:
        Query.viewAll().then((products)=>{
          console.table(products);
        });
        Query.close();
      break;

      case 2:
        Query.viewLow().then((products)=>{
          console.table(products)
        })
        Query.close();
      break;

      case 3:
        // TO DO:
        inquirer.prompt([
          {name: "id", type: "input", message: "What id?"},
          {name: "quantity", type: "input", message: "How many would you like to add?"}
        ]).then((input)=>{
          // console.log(input);
          // take inquirer promise & make db Query 
          Query.restock(input.id, input.quantity).then((result)=>{
            if (result) console.log("Success!");
            Query.close();
          })
        })
      break;

      case 4:
        inquirer.prompt([
          {name: "product_name", type: "input", message: "Product name?"},
          {name: "department_id", type: "input", message: "Department id?"},
          {name: "price", type: "input", message: "Price?" },
          {name: "stock_quantity", type: "input", message: "How many items?"}
        ]).then((input)=>{
          Query.newProduct(input).then((result)=>{
            if (result.affectedRows == 1) console.log("Success!");
            Query.close();
          });
        })
      break;

      default:
        console.log("Option not found");
      break;
    } // end of switch
  }) // end .then of inquirer
}