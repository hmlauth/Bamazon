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

-- query for supervisor view for table
SELECT 
	d.department_id AS Department_ID,
	d.department_name AS Department_Name,
    d.over_head_costs AS Overhead_Costs,
    SUM(p.product_sales) Product_Sales,
    (SUM(p.product_sales) - d.over_head_costs) as Total_Profits
FROM departments d
INNER JOIN products p
ON (d.department_name = p.department_name)
GROUP BY department_name, d.over_head_costs, d.department_id;

-- subquery for net total profits and net total sales 
SELECT SUM(totalSales) as ts, SUM(total_profits) as tp FROM (SELECT 
	d.department_name,
    SUM(p.product_sales) totalSales,
    (SUM(p.product_sales) - d.over_head_costs) as total_profits
FROM departments d
INNER JOIN products p
ON (d.department_name = p.department_name)
GROUP BY department_name, d.over_head_costs
) as all_deparments;