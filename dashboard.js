// Require dependencies

const inquirer = require("inquirer");
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

// Require connection
const mysql = require("mysql");
const config = require('./config');


// Require Customer, Manager, and Supervisor files
const Customer = require('./bamazonCustomer.js');
const Manager = require('./bamazonManager.js');
const Supervisor = require('./bamazonSupervisor.js');

const connection = mysql.createConnection(config);

connection.connect(function (err) {
    if (err) { throw err }
    else { displayDashboard() }
});

// Display Dashboard
function displayDashboard() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Please select desire view:",
                choices: ['Customer','Manager','Supervisor'],
                name: "command"
            }
        ]).then(function (answer) {
            start(answer.command);
        })
}

function start(command) {
    switch (command) {
        case 'Customer':
        Customer.startCustomerView();
        break;
    
        case 'Manager':
        Manager.startManagerView();
        break;
    
        case 'Supervisor':
        Supervisor.startSupervisorView();
        break;
    }
}
