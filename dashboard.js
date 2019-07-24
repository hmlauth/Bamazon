// Require dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const config = require('./config');
const colors = require('colors');
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

const Customer = require('./bamazonCustomer.js');
console.log('CUSTOMER', Customer);


// CONNECT TO MYSQL
const connection = mysql.createConnection(config);
connection.connect(function (err) {
  if (err) throw err;
  displayDashboard();
});

// Require Customer, Manager, and Supervisor files
// Create inquirer prompt to switch between dashboards
function displayDashboard() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Please select desire view:",
                choices: ['Customer','Manager','Supervisor'],
                name: "command"
            }
        ]).then(function (command) {
            console.log(command);
            start(command);
        })
}

function start(command) {
    switch (command) {
        case 'Customer':
        startCustomerView();
        break;
    
        case 'Manager':
        startManagerView();
        break;
    
        case 'Supervisor':
        startSupervisorView();
        break;
    }
}
