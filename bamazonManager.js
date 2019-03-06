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
                addToInventory();
              } else if (answers.managerChoice === "Add New Product") {
          
              } else if (answers.managerChoice === "Exit") {
                      connection.end();
              }
      })
  }


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
                        viewLowInventory();
                    } else if (answers.managerChoice === "Add to Inventory") {
                        addToInventory();
                    } else if (answers.managerChoice === "Add New Product") {
                        addNewProduct();
                    }
                }
            )
        }
    )
}

function viewLowInventory() {
    console.log("Getting low inventory items...\n");
    connection.query(
        "SELECT * FROM products", 
          function (err, res) {
            if (err) throw err;
            var lowInventoryItems = [];
            for (var i = 0; i < res.length; i++) {
                if (res[i].stock_quantity <= 5 ) {
                    lowInventoryItems.push(res[i])
                }
            }

            console.table(lowInventoryItems);

            inquirer
                .prompt([
                    {
                        type: "rawlist",
                        message: "How would you like to proceed?",
                        choices: [
                            "View Products for Sale",
                            "Add to Inventory",
                            "Add New Product",
                            "Exit"
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
                            addToInventory();
                        } else if (answers.managerChoice === "Add New Product") {
                            addNewProduct();
                        } else if (answers.managerChoice === "Exit") {
                            connection.end();
                        }
                })
            }
    )
}

function addNewProduct() {
    inquirer
        .prompt([
        {
            type: "input",
            message: "What is the name of the product you would like to add?",
            name: "productName",
        },
        {
            type: "input",
            message: "What department is this product in?",
            name: "departmentName",
        },
        {
            type: "input",
            message: "What is the price for 1 unit of this product?",
            name: "pricePoint",
            validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
            }
        },
        {
            type: "input",
            message: "How many units of this product are you adding?",
            name: "stockQuantity",
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }
        }
        ]).then(function(answer) {
            console.log("Updating inventory...\n");
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.productName,
                    department_name: answer.departmentName,
                    price: answer.pricePoint || 0,
                    stock_quantity: answer.stockQuantity || 0
                },
                function (err, res) {
                    if (err) throw err;
                }

                displayProducts();

                inquirer
                .prompt([
                    {
                        type: "rawlist",
                        message: "How would you like to proceed?",
                        choices: [
                            "View Products for Sale",
                            "Add to Inventory",
                            "Add New Product",
                            "Exit"
                            ],
                        name: "managerChoice"
                    }
                ]).then(function(answers) {

                    if (answers.managerChoice === "View Products for Sale") {
                        displayProducts();
                        } else if (answers.managerChoice === "Add to Inventory") {
                            addToInventory();
                        } else if (answers.managerChoice === "Add New Product") {
                            addNewProduct();
                        }
                    }
                )
            );
        });
}

// function addTo Inventory() {

// }

// METHODS
promptManager()