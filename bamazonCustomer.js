const inquirer = require("inquirer");

const mysql = require("mysql");
const config = require('./config');
const connection = mysql.createConnection(config);
connection.connect(function (err) {
    if (err) { throw err }
});

// FUNCTIONS
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
  }
  )
}

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
          let choiceArray = [];
          res.forEach(cv => choiceArray.push(cv.product_name))
          return choiceArray;
          },
      },
      {
        type: "input",
        message: "How many units would you like buy?",
        name: "stock_quantityChoice",
        validate: function(value) {
          if (!isNaN(value)) {
            return true;
          }
          return "Please enter a valid number";
        }
      }
    ]).then( answer => {
      console.log("\nTransaction processing...\n".data);
      
     let chosenItemID = findChosenItem(res, answer);
      
      connection.query(
        "SELECT * FROM products WHERE ?", 
        { item_id: chosenItemID }, 
        function (err, res) {
          if (err) throw err;
          let oldStockQuantity = parseInt(res[0].stock_quantity);
          let newStockQuantity = parseInt(oldStockQuantity) - parseInt(answer.stock_quantityChoice);
          // total cost of purchase
          let costOfPurchase = parseFloat(res[0].price) * parseInt(answer.stock_quantityChoice);
          let productSales = parseFloat(res[0].product_sales) + parseFloat(costOfPurchase);

          if (newStockQuantity < 0) {
              if (oldStockQuantity === 1) {
                console.log("Insufficient quantity!".warn + " There is only ".info + oldStockQuantity + " unit of this product available.".info);
              } else if (oldStockQuantity > 1) {
                console.log("Insufficient quantity!".warn + " There are only ".info + oldStockQuantity + " units of this product available.".info);
              }
            promptBuyer();
          } else {
            updateProducts(newStockQuantity,productSales,chosenItemID, costOfPurchase);
            } 
          } 
        )
      }); 
    });
  }; 

function updateProducts(newStockQuantity,productSales,chosenItemID, costOfPurchase) {
  connection.query(
    "UPDATE products SET ?? WHERE ?",
    [ 
      {stock_quantity: newStockQuantity},
      {product_sales: productSales},
      {item_id: chosenItemID}
    ], 
    function (err, res) {
        console.log("\tTransaction complete!".info.bold + "\n\tTotal Cost: ".info + "$" + costOfPurchase.toFixed(2) + "\n".info);
        inquirer  
          .prompt([
            {
              type: "rawlist",
              message: "Would you like to place another purchase?",
              choices: ["Yes","No"],
              name: "secondPurchaseChoice"
            }
          ])
          .then(answer => {
            switch (answer.secondPurchaseChoice) {
              case "Yes":
                promptBuyer();
                break;

              case "No":
                stopShopping();
                break;
            }
          })
      } 
    ) 
}

function stopShopping() {
  console.log("\nThanks for shopping. See you next time!\n".verbose);
  connection.end();
}

function findChosenItem(array, answer) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].product_name === answer.item_idChoice) {
        return array[i].item_id
    }
  }
}

module.exports = {
  startCustomerView: startShopping
}