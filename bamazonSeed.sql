DROP DATABASE IF EXISTS bamazon_db;
DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(30),
  department_name VARCHAR(30),
  price DECIMAL(11,2) NULL,
  stock_quantity INT(11),
  product_sales DECIMAL(11,2),
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity,product_sales)
VALUES 
    ("Fortnite","Video Games","39.99",2,0.00),
    ("Fallout","Video Games","39.99",10,0.00),
    ("Yoga Mat","Health & Fitness","59.99",5,0.00),
    ("Blood Glucose Monitor","Health & Fitness","59.99",10,0.00),
    ("Medicine Ball","Health & Fitness","29.99",30,0.00),
    ("Coconut Flour","Grocery & Gourmet Foods","9.99",75,0.00),
    ("Chocolate Covered Almonds","Grocery & Gourmet Foods","11.99",5,0.00),
    ("Isopure - Chocolate","Health & Fitness","39.99",50,0.00),
    ("Silicon Sheet","Home & Kitchen","29.99",40,0.00),
    ("Spiralizer","Home & Kitchen","9.99",65,0.00),
    ("Charcoal Face Mask","Beauty & Personal Care","4.99",100,0.00);


CREATE TABLE departments (
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(50),
over_head_costs INT(11),
PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name,over_head_costs)
VALUES 
("Appliances",1000),
("Apps & Games",1000),
("Arts, Crafts & Sewing",1000),
("Automotive Parts & Accessories",1000),
("Baby",1000),
("Beauty & Personal Care",1000),
("Books",1000),
("CDs",1000),
("Clothing, Shoes & Jewelry",1000),
("Electronics",1000),
("Garden & Outdoor",1000),
("Gift Cards",1000),
("Grocery & Gourmet Foods",1000),
("Health & Fitness",1000),
("Home & Kitchen",1000),
("Travel",1000),
("Video Games",1000);

SELECT * FROM products;
SELECT * FROM departments

-- query to join table products and departments table for supervisor view and include the products.product_sales.
SELECT 
	departments.department_id,
    departments.department_name,
    departments.over_head_costs, 
    products.product_sales,
    (departments.over_head_costs - products.product_sales) AS total_profit
FROM departments
INNER JOIN products
ON (products.department_name = departments.department_name);