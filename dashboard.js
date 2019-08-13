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
const config = require('./config/config.js');

// Require Customer, Manager, and Supervisor files
const Customer = require('./app/bamazonCustomer.js');
const Manager = require('./app/bamazonManager.js');
const Supervisor = require('./app/bamazonSupervisor.js');

const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) { throw err }
    else { displayDashboard() }
});

// Display Dashboard
function displayDashboard() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Please select desired view:",
                choices: ['Customer','Manager','Supervisor','Exit'],
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

        case 'Exit':
        connection.end();
        break;
    }
}

