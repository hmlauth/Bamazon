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
                createNewDepartment();
                break;

            case ("Exit"):
                connection.end();
                break;
        }
    })
}

function displayOverviewOfDepartments() {
    console.log("\nShowing current department stats...\n");
    var query = "SELECT departments.department_id,departments.department_name,departments.over_head_costs,products.product_sales,(departments.over_head_costs - products.product_sales) AS total_profit FROM departments INNER JOIN products ON (products.department_name = departments.department_name)";
    connection.query(
      query, 
      function (err, res) {
        if (err) throw err;
        console.table(res);
        promptSupervisor();
        }
    )
}

function createNewDepartment() {
    connection.query("SELECT * FROM departments", 
    function(err, res) {
        if (err) throw err;
    inquirer
        .prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "departmentName",
        },
        {
            type: "input",
            message: "What is the overhead cost for this department?",
            name: "overHeadCosts",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
                }
        }
        ]).then(function(answer) {
            console.log("Updating departments...\n");
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.departmentName,
                    over_head_costs: answer.overHeadCosts
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("Department Added!")
                    promptSupervisor();
                },
            );
        });
    })
}


promptSupervisor();