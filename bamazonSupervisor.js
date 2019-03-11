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
  welcomeSupervisor();
});

function welcomeSupervisor() {
    console.log("\nWelcome to Supervisor View!\n".verbose);
    promptSupervisor();
}

function promptSupervisor() {
    inquirer
    .prompt([
        {
            type: "rawlist",
            message: "How would you like to proceed?",
            choices: ["View Products for Sale","View All Departments","Create a New Department","Exit"],
            name: "supervisorChoice"
        }
    ])
    .then(function(answers) {
        switch (answers.supervisorChoice) {
            case ("View All Departments"):
                viewAllDepartments();
                break;

            case ("View Products for Sale"):
                viewProductsForSale();
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

function viewProductsForSale() {
    getAllDepartments();
    console.log("\nGetting department overview...\n".data);
        var query = "SELECT departments.department_id,departments.department_name,departments.over_head_costs,products.product_sales,(products.product_sales - departments.over_head_costs) AS total_profit FROM departments INNER JOIN products ON (products.department_name = departments.department_name)";
        connection.query(
            query, 
            function (err, res) {
                if (err) throw err;
                // determine how many ACTIVE departments there are
                var totalActiveDepartmentArray = [];
                    for (var i = 0; i < res.length; i++) {
                        totalActiveDepartmentArray.push(res[i].department_id);
                    }
                    
                    console.log(("Showing " + totalActiveDepartmentArray.length + " active departments.\n").info);

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
            console.log("\nUpdating departments...\n".data);
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.departmentName,
                    over_head_costs: answer.overHeadCosts
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("\tNew department successfully added!\n".info)
                    promptSupervisor();
                },
            );
        });
    })
}

function viewAllDepartments() {
    console.log("\nShowing all departments...\n".info);
    var query = "SELECT departments.department_id,departments.department_name,departments.over_head_costs FROM departments";
    connection.query(
      query, 
      function (err, res) {
        if (err) throw err;
        console.table(res);
        promptSupervisor();
        }
    )
}

function getAllDepartments() {
    var query = "SELECT departments.department_id,departments.department_name,departments.over_head_costs FROM departments";
    connection.query(
    query, 
    function (err, res) {
    if (err) throw err;
        var totalDepartmentArray = [];
        for (var i = 0; i < res.length; i++) {
            totalDepartmentArray.push(res[i].department_id);
            }
            
        console.log(("...of " + totalDepartmentArray.length + " total departments...\n").data);

    })
}