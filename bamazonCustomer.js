var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");
var colors = require('colors');

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
  startShopping();
});

// FUNCTIONS
// display all items available for sale
function displayProducts() {
  console.log("\nShowing current inventory...\n");
  connection.query(
    "SELECT item_id,product_name,department_name,price,stock_quantity FROM products", 
    function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      promptBuyer();
  });
}

function promptBuyer() {
    inquirer.prompt([
      {
        type: "input",
        message: "From the table above, please select the item_id for the product you'd like to purchase.",
        name: "item_idChoice"
      },
      {
        type: "input",
        message: "How many units would you like buy?",
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
          var productSales = res[0].product_sales + costOfProduct;

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
                  promptBuyer();
                } 
              ) 
            } 
          } 
        )
      }); 
    }; 


function startShopping() {
  console.log("\nWelcome to Bamazon!\n");
  inquirer.prompt([
    {
      type: "list",
      message: "Select 'Yes' to start shopping!",
      choices: ["Yes","Exit"],
      name: "buyerChoice"
    }
  ]).then(function (answer) {
    if (answer.buyerChoice === "Exit") {
      console.log("Thank you for stopping by. See you next time!");
      connection.end();
    } else if (answer.buyerChoice === "Yes") {
      displayProducts();
    }
  })
}
