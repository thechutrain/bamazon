CREATE DATABASE IF NOT EXISTS bamazon_db;
use bamazon_db;

CREATE TABLE IF NOT EXISTS department (
  id int NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(32),
  over_head_cost DECIMAL(9,2),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS product (
  id int NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(64),
  department_id int,
  price DECIMAL(8,2),
  stock_quantity int,
  FOREIGN KEY (department_id) REFERENCES department(id),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sale (
  id int NOT NULL AUTO_INCREMENT,
  product_id int,
  quantity_purchased int,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES product (id),
  PRIMARY KEY (id)
);

# Populate Department & Products
INSERT INTO department (department_name, over_head_cost)
    VALUES ("Books", 567.89),
      ("Electronics", 1672.50),
      ("Clothing", 1250);

INSERT INTO product (product_name, department_id, price, stock_quantity)
    VALUES
      ("Animal Farm", 1, 12.95, 1984),
      ("Zen and the Art of Motorcycle Maintenance", 1, 19.95, 500),
      ("Cracking the Coding Interview", 1, 25, 75),
      ("Ipod", 2, 199.95, 1000),
      ("headphones", 2, 99.99, 350),
      ("MacBook pro", 2, 1200, 30),
      ("trucker hat", 3, 15.99, 100),
      ("denim jacket", 3, 47.95, 15),
      ("cowboy boots", 3, 125.50, 10),
      ("khaki pants", 3, 25.95, 15);

# INSERT INTO sale (product_id, quantity_purchased) VALUES (1, 1900);
INSERT INTO sale (product_id, quantity_purchased)
  VALUES (2, 10), (4, 10), (5, 10), (7, 100), (9, 5);

# SUPERVISOR QUERY
SELECT p.department_id, d.department_name, d.over_head_cost, SUM(s.quantity_purchased * p.price) as product_sales,
  (SUM(s.quantity_purchased * p.price) - d.over_head_cost) as total_profit
  FROM sale s LEFT JOIN product p ON s.product_id = p.id
  INNER JOIN department d ON p.department_id = d.id
  GROUP BY p.department_id
  ORDER BY total_profit DESC;

