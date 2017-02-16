var mysql = require("mysql");

// ================= Setting up SQL connection ======================
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'foo',
  password : 'bar',
  database : 'bamazon_db',
  multipleStatements: true 
});

// ================= Queries=========================
// 1) view product sales by department
// 2) Create new department

exports.salesByDepartment = function(){
  // this function will display:
  // department_name | over_head_costs | product_sales | total_profit
  return new Promise((resolve, reject)=>{
    var query = `
    SELECT p.department_id, d.department_name, d.over_head_cost, SUM(s.quantity_purchased * p.price) as product_sales,
    (SUM(s.quantity_purchased * p.price) - d.over_head_cost) as total_profit
    FROM sale s LEFT JOIN product p ON s.product_id = p.id
    INNER JOIN department d ON p.department_id = d.id
    GROUP BY p.department_id
    ORDER BY total_profit DESC;`;
    connection.query(query, function(error, results){
      // console.log(results);
      resolve(results);
    })
  })
}


// ================= Helpers =========================
exports.end = function(){
  connection.end();
}