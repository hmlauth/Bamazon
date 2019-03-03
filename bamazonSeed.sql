DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon.db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(30),
  department_name VARCHAR(30),
  price DECIMAL(11,2) NULL,
  stock_quantity INT(11),
  PRIMARY KEY (id)
);

INSERT INTO prodcuts (product_name,department_name,price,stock_quantity)
VALUES 
    ("Fortnite","Gaming","39.99",50),("Fallout","Gaming","39.99",10),
    ("Yoga Mat","Fitness","59.99",100),("Blood Glucose Monitor","Health","59.99",10),("Medicine Ball","Fitness","29.99",30),("Coconut Flour","Grocery","9.99",75),("Chocolate Covered Almonds","Grocery","11.99",150),("Isopure - Chocolate","Fitness","39.99",50),("Silicon Sheet","Kitchen","29.99",40),("Spiralizer","Kitchen","9.99",65);

SELECT * FROM products;