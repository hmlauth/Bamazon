const cTable = require('console.table');
const inquirer = require("inquirer");
const mysql = require("mysql");
const config = require('../config/config.js');

const connection = mysql.createConnection(config);

connection.connect( (err) => {
    if (err) { throw err }
});

function welcomeManager() {
    console.log("\nWelcome to Manager View!\n".verbose);
    promptManager();
  };

function promptManager() {
    inquirer
        .prompt([
            {
                type: "rawlist",
                message: "How would you like to proceed?",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
                    "Remove a Product",
                    "Exit"
                    ],
                name: "managerChoice"
            }
        ]).then(answers => {
            switch (answers.managerChoice) {
                case "View Products for Sale":
                    displayProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;
                    
                case "Add New Product":
                    addNewProduct();
                    break;

                case "Remove a Product":
                    removeProductFromInventory();
                    break;
                    
                case "Exit":
                    sayGoodbye();
                    break;
                }
            }
        )
  };

// display all items available for sale
function displayProducts() {
    console.log("\nShowing current inventory...\n".info);
    connection.query(
      "SELECT * FROM products", 
      (err, res) => {
        if (err) throw err;
        console.table(res);
        promptManager();
        }
    )
}

function viewLowInventory() {
    console.log("\nGetting low inventory items...\n".data);
    connection.query(
        "SELECT * FROM products", 
          (err, res) => {
            if (err) throw err;
            let lowInventoryItems = res.filter(cv => cv.stock_quantity <= 5);
            if (lowInventoryItems.length === 0) {
                console.log("\tThere are no low inventory items at this time.\n".info)
            } else {
                console.table(lowInventoryItems);
            }
            
            promptManager();

            }
    )
}

function addNewProduct() {
    connection.query("SELECT * FROM departments", 
    (err, res) => {
        if (err) throw err;
    inquirer
        .prompt([
        {
            type: "input",
            message: "What is the name of the product you would like to add?",
            name: "productName",
        },
        {
            type: "rawlist",
            message: "What department is this product in?",
            name: "departmentName",
            choices: function() {
                let choiceArray = [];
                for (let i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].department_name);
                    }
                    return choiceArray;
                },  
        },
        {
            type: "input",
            message: "What is the price for 1 unit of this product?",
            name: "pricePoint",
            validate: function(value) {
            if (!isNaN(value)) {
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
                if (!isNaN(value)) {
                return true;
                }
                return false;
            }
        }
        ]).then(answer => {
            console.log("\nUpdating inventory...\n".data);
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.productName,
                    department_name: answer.departmentName,
                    price: answer.pricePoint || 0,
                    stock_quantity: answer.stockQuantity || 0,
                    product_sales: 0
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(("\t" + answer.productName + " has been successfully added!\n").info)
                    promptManager();
                },
            );
        });
    })
}

function addToInventory() {
    // query products table to obtain list of products so that user can chose from current inventory.
    connection.query("SELECT * FROM products", 
    (err, res) => {
        if (err) throw err;
        // now that we have queried the table, prompt user to select on of the products in the current inventory. 
        inquirer
        .prompt([
            {
                name: "choice",
                type: "rawlist",
                message: "What product would you like to add too?",
                choices: function() {
                    let choiceArray = [];
                    for (let i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].product_name);
                        }
                        return choiceArray;
                    },
            },
            {
                name: "quantity",
                type: "input",
                message: "How many units would you like to add?",
                validate: value => {
                    if (!isNaN(value)) {
                        return true;
                        }
                        return false;
                    }
            }
        ])
        .then(answer => {
            console.log(("\nUpdating inventory for " + answer.choice + "...").data);
            let chosenItem;
            for (let i = 0; i < res.length; i++) {
                if (res[i].product_name === answer.choice) {
                    chosenItem = res[i]
                }
            }

            let currentQuantity = chosenItem.stock_quantity + parseInt(answer.quantity);

            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    { stock_quantity: currentQuantity },
                    { product_name: answer.choice }
                ],
                error => {
                if (error) throw err;
                console.log(("\n\tInventory for "+ answer.choice + " successfully updated with "+ chosenItem.stock_quantity + " units." + ("\n\tTotal units now at " + currentQuantity + ".\n").italic).info);
                inquirer.prompt([
                    {
                        type: "rawlist",
                        message: "Would you like to add to another low inventory item?",
                        choices: ["Yes","No"],
                        name: "choice"
                    }
                ])
                .then(answer => {
                    switch (answer.choice) {
                        case ("Yes"):
                        addToInventory();
                        break;

                        case ("No"):
                        promptManager();
                        break;
                    }
                })
                    
                }
            );
        });
    });
}

function removeProductFromInventory() {
    connection.query("SELECT * FROM products", 
    (err, res) => {
    if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    message: "Which product would you like to remove?",
                    choices: () => {
                        let choiceArray = [];
                        for (let i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name);
                            }
                            return choiceArray;
                        },
                }
            ]).then(answer => {
                console.log(("\nDeleting " + answer.choice + "\n").data);
                connection.query("DELETE FROM products WHERE ?",
                    { product_name: answer.choice },
                    (err, res) => {
                        console.log(("\t" + answer.choice + " successfully deleted!\n").info);
                        promptManager();
                    }
                );
            })
        }
    )
}

function sayGoodbye() {
    console.log("\nBye!\n".data);
    connection.end();
}

module.exports = {
    startManagerView: welcomeManager
}