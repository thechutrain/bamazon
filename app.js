var inquirer = require("inquirer");

// my lib
var manager = require("./lib/bamazonManager");
var customer = require("./lib/bamazonCustomer");
var supervisor = require("./lib/bamazonSupervisor");

const PASSWORD = "password"; // Obviously fake

// TESTING
// manager(); // WORKS
// customer(); // WORKS
// supervisor(); // WORKS
askUserPortal();

function askUserPortal(){
  inquirer.prompt([
    {
      name: "choice",
      message: "What option would you like to pick?",
      type: "list",
      choices: [
        "1. Customer Portal",
        "2. Manager Portal",
        "3. Supervisor Portal",
        "4. EXIT"
      ]
    }
  ]).then((input)=>{
    var choice = parseInt(input.choice.charAt(0));
    switch(choice){
      case 1:
        customer();
        // customer().then(()=>{
        //   askUserPortal();
        // }, err => {console.log(err)});
      break;
      case 2:
        manager();
      break;
      case 3:
        supervisor();
      break;
      case 4:
        console.log("Thank you and goodbye!");
      break;
      default:
        console.log("Did not compute Error!");
      break;
    } // end switch
  })
}
