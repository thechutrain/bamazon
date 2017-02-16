var Query = require("./queries");
require("console.table");

// Get all products
Query.getAllProducts().then((productsArray)=>{
  console.table(productsArray);
}, (err)=> {console.log(err)})

// Get individual Product
Query.checkProduct(22).then((productObj)=>{
  console.log(productObj);
}, (err)=> {console.log(err)})

// close connection
Query.close();