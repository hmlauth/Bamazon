var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

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
  });

// display all items available for sale
function displayProducts() {
    console.log("\nShowing current inventory...\n");
    connection.query(
      "SELECT * FROM products", 
      function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        inquirer
            .prompt([
                {
                    type: "rawlist",
                    message: "How would you like to proceed?",
                    choices: [
                        "View Low Inventory",
                        "Add to Inventory",
                        "Add New Product",
                        "Exit"
                        ],
                    name: "managerChoice"
                }
            ]).then(function(answers) {

                if (answers.managerChoice === "View Low Inventory") {
            
                    } else if (answers.managerChoice === "Add to Inventory") {
                
                    } else if (answers.managerChoice === "Add New Product") {
            
                    }
                }
            )
        }
    )
}

function viewLowInventory() {
    console.log("Getting low inventory items...");
    connection.query(
        "SELECT * FROM products", 
          function (err, res) {
            if (err) throw err;
            var lowInventoryItems = [];
            for (var i = 0; i < res.length; i++) {
                if (res[i].stock_quantity === 5 ) {
                    lowInventoryItems.push(res[i])
                }
                return lowInventoryItems
            }
            // if (res <= 5) {
            //     console.table()
            // }

            // if (newStockQuantity < 0) {
            //   console.log("Insufficient quantity! There are only " + oldStockQuantity + " units of this product available.");
            //   promptBuyer();
            // } else {
        }
    )
}

function promptManager() {
  inquirer
    .prompt([
        {
            type: "rawlist",
            message: "Welcome! Choose an option:",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
                ],
            name: "managerChoice"
        }
    ]).then(function(answers) {
        console.log(answers.managerChoice);
        if (answers.managerChoice === "View Products for Sale") {
            displayProducts();
            } else if (answers.managerChoice === "View Low Inventory") {
            viewLowInventory();
            } else if (answers.managerChoice === "Add to Inventory") {
        
            } else if (answers.managerChoice === "Add New Product") {
        
            } else if (answers.managerChoice === "Exit") {
                    connection.end();
            }
    })
}


promptManager();