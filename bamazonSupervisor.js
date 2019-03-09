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
 // add function here
});

function promptSupervisor() {
    inquirer
    .prompt([
        {
            type: "rawlist",
            message: "How would you like to proceed?",
            choices: ["View Products for Sale","Create a New Department","Exit"],
            name: "supervisorChoice"
        }
    ])
    .then(function(answers) {
        switch (answers.supervisorChoice) {
            case ("View Products for Sale"):
                displayOverviewOfDepartments();
                break;

            case ("Create a New Department"):
                // function
                break;

            case ("Exit"):
                connection.end();
                break;
        }
    })
}

function displayOverviewOfDepartments() {
    console.log("\nShowing current department stats...\n");
    connection.query(
      "SELECT * FROM departments", 
      function (err, res) {
        if (err) throw err;
        console.table(res);
        promptSupervisor();
        }
    )
}

promptSupervisor();