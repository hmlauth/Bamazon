var inquirer = require("inquirer");
const mysql = require("mysql");
const config = require('./config');
const connection = mysql.createConnection(config);
connection.connect(function (err) {
    if (err) { throw err }
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
            choices: ["View Products Sales by Department","View All Departments","Create a New Department","Exit"],
            name: "supervisorChoice"
        }
    ])
    .then(function(answers) {
        switch (answers.supervisorChoice) {
            case ("View All Departments"):
                viewAllDepartments();
                break;

            case ("View Products Sales by Department"):
                viewProductsForSale();
                break;

            case ("Create a New Department"):
                createNewDepartment();
                break;

            case ("Exit"):
                sayGoodbye();
                connection.end();
                break;
        }
    })
}

function viewProductsForSale() {
    getAllDepartments();
    console.log("\nGetting department overview...\n".data);
        var query = "SELECT d.department_id AS Department_ID, d.department_name AS Department_Name, d.over_head_costs AS Overhead_Costs, SUM(p.product_sales) AS Product_Sales, (SUM(p.product_sales) - d.over_head_costs) AS Total_Profits FROM departments d INNER JOIN products p ON (d.department_name = p.department_name) GROUP BY department_name, d.over_head_costs, d.department_id"
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
            
                // query total sales and total profits
                var queryTotals = "SELECT SUM(totalSales) as Total_Sales, SUM(total_profits) as Total_Profits FROM (SELECT d.department_name,SUM(p.product_sales) totalSales,(SUM(p.product_sales) - d.over_head_costs) as total_profits FROM departments d INNER JOIN products p ON (d.department_name = p.department_name) GROUP BY department_name, d.over_head_costs) as all_deparments"
                connection.query(
                    queryTotals,
                    function(err, res) {
                        if (err) throw err;
                        console.table(res);
                        promptSupervisor();
                    }
                )
                
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
    var query = "SELECT departments.department_id AS Department_ID,departments.department_name AS Department_Name,departments.over_head_costs AS Overhead_Costs FROM departments";
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

function sayGoodbye() {
    console.log("\nBye!\n".data)
}

module.exports = {
    startSupervisorView: welcomeSupervisor
}