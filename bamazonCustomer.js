var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");
var colors = require('colors');
    colors.setTheme({
        input: 'blue',
        verbose: 'cyan',
        prompt: 'white',
        info: 'green',
        data: 'grey',
        warn: 'yellow',
        error: 'red',
        silly: 'rainbow'
    });

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
  console.log("\nShowing current inventory...\n".info);
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
  console.log("\n-----------------------------------------------\n".verbose);
  connection.query("SELECT * FROM products",
  function(err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "rawlist",
        message: "Which product would you like to purchase?\n",
        name: "item_idChoice",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].product_name);
              }
              return choiceArray;
          },
      },
      {
        type: "input",
        message: "How many units would you like buy?",
        name: "stock_quantityChoice",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return "Please enter a valid number";
        }
      }
    ]).then(function (answer) {
      console.log("\nTransaction processing...\n".data);

      var chosenItem;
      for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === answer.item_idChoice) {
              chosenItem = res[i]
          }
      }
      var chosenItemID = chosenItem.item_id;

      connection.query(
        "SELECT stock_quantity,price,product_sales FROM products WHERE item_id = ?", 
        chosenItemID, 
        function (err, res) {
          if (err) throw err;
          var oldStockQuantity = res[0].stock_quantity;
          var newStockQuantity = oldStockQuantity - answer.stock_quantityChoice;
          // total cost of purchase
          var costOfProduct = res[0].price * answer.stock_quantityChoice;
          var productSales = res[0].product_sales + costOfProduct;

          if (newStockQuantity < 0) {
              if (oldStockQuantity === 1) {
                console.log("Insufficient quantity!".warn + " There is only ".info + oldStockQuantity + " unit of this product available.".info);
              } else if (oldStockQuantity > 1) {
                console.log("Insufficient quantity!".warn + " There are only ".info + oldStockQuantity + " units of this product available.".info);
              }
            promptBuyer();
          } else {
            connection.query(
              "UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?",
              [ 
                newStockQuantity,
                productSales,
                chosenItemID
              ], 
              function (err, res) {
                  console.log("\tTransaction complete!".info.bold + "\n\tTotal Cost: ".info + "$" + costOfProduct.toFixed(2) + "\n".info);
                  inquirer  
                    .prompt([
                      {
                        type: "rawlist",
                        message: "Would you like to place another purchase?",
                        choices: ["Yes","No"],
                        name: "secondPurchaseChoice"
                      }
                    ])
                    .then(function(answer) {
                      switch (answer.secondPurchaseChoice) {
                        case ("Yes"):
                          promptBuyer();
                          break;

                        case("No"):
                          stopShopping();
                          break;
                      }
                    })
                } 
              ) 
            } 
          } 
        )
      }); 
    });
  }; 


function startShopping() {
  console.log("\nWelcome to Bamazon!\n".verbose);
  inquirer.prompt([
    {
      type: "list",
      message: "Select 'Yes' to start shopping!",
      choices: ["Yes","Exit"],
      name: "buyerChoice"
    }
  ]).then(function (answer) {
    if (answer.buyerChoice === "Exit") {
      stopShopping();
    } else if (answer.buyerChoice === "Yes") {
      displayProducts();
    }
  })
}

function stopShopping() {
  console.log("\nThank you for stopping by. See you next time!\n".verbose);
  connection.end();
}