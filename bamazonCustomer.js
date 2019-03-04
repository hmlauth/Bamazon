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
      console.log("Press CTRL c to exit.")
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
          name: "stock_quantityChoice"
        }
      ]).then(function (answer) {
        console.log("Updating quantities...\n");
        connection.query(
          "SELECT stock_quantity FROM products WHERE item_id = ?", 
          answer.item_idChoice, 
          function (err, res) {
            if (err) throw err;
            var oldStockQuantity = res[0].stock_quantity;
            var newStockQuantity = oldStockQuantity - answer.stock_quantityChoice;

            if (newStockQuantity < 0) {
              console.log("Insufficient quantity! There are only " + oldStockQuantity + " units of this product available.");
              promptBuyer();
            } else {
              connection.query(
                "UPDATE products SET ? WHERE ?", 
                  [
                    {stock_quantity: newStockQuantity},
                    {item_id: answer.item_idChoice}
                  ], function (err, res) {
                    connection.query(
                      "SELECT price FROM products WHERE item_id = ?", 
                      answer.item_idChoice, 
                      function (err, res) {
                        if (err) throw err;
                        var costOfProduct = res[0].price * answer.stock_quantityChoice;
                        console.log("\tTransaction complete! \n\tTotal Cost: $" + costOfProduct + "\n");
                        displayProducts();
                    }
                  )
                }
              )
            }
          }
        );
      });
    }
  })
}