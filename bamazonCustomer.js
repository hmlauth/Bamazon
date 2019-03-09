var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

// CONNECT TO MYSQL
var connection = mysql.createConnection({
  host: "localhost",

  // Your port
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  displayProducts();
});

// FUNCTIONS
// display all items available for sale
function displayProducts() {
  console.log("\nShowing current inventory...\n");
  connection.query(
    "SELECT * FROM products", 
    function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      promptBuyer()
  });
}

function promptBuyer() {
  inquirer.prompt([
    {
      type: "list",
      message: "Would you like to purchase something?",
      choices: ["Yes", "No"],
      name: "buyerChoice",
    }
  ]).then(function (answer) {
    if (answer.buyerChoice === "No") {
      console.log("Thanks for shopping!");
      connection.end();
    } else if (answer.buyerChoice === "Yes") {
      inquirer.prompt([
        {
          type: "input",
          message: "Please select the item_id that you would like to purchase.",
          name: "item_idChoice"
        },
        {
          type: "input",
          message: "How many units would you like buy of this product?",
          name: "stock_quantityChoice",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ]).then(function (answer) {
        console.log("Updating quantities...\n");
        connection.query(
          "SELECT stock_quantity,price,product_sales FROM products WHERE item_id = ?", 
          answer.item_idChoice, 
          function (err, res) {
            if (err) throw err;
            var oldStockQuantity = res[0].stock_quantity;
            var newStockQuantity = oldStockQuantity - answer.stock_quantityChoice;
            // total cost of purchase
            var costOfProduct = res[0].price * answer.stock_quantityChoice;
            console.log("res", res);
            console.log("product_sales: " + res[0].product_sales);
            console.log("Total Cost of Proudct: " + costOfProduct);
            var productSales = res[0].product_sales + costOfProduct;
            console.log("productSales: " + productSales);

            if (newStockQuantity < 0) {
                if (oldStockQuantity === 1) {
                  console.log("Insufficient quantity! There is only " + oldStockQuantity + " unit of this product available.\n");
                } else if (oldStockQuantity > 1) {
                  console.log("Insufficient quantity! There are only " + oldStockQuantity + " units of this product available.\n");
                }
              promptBuyer();
            } else {
              connection.query(
                "UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?",
                [
                  newStockQuantity,
                  productSales,
                  answer.item_idChoice
                ], 
                function (err, res) {
                    console.log("\tTransaction complete! \n\tTotal Cost: $" + costOfProduct + "\n");
                    displayProducts();
                  } 
                ) 
              } 
            } 
          )
        }); 
    }; 
  }) 
}