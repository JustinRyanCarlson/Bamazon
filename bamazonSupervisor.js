//
// VARIABLES AND REQUIRES -------------------------------------------------------------------------------------------------------------
//

var mysql = require('mysql');
var inquirer = require('inquirer');
var fs = require('fs');
require('console.table');
var connection;

//
// BASE CODE --------------------------------------------------------------------------------------------------------------------------
//

// Reads the text in local_server_password.txt and passes it to the connectSQL function.
fs.readFile('local_server_password.txt', 'utf8', function(err, data) {
    if (err) throw err;

    connectSQL(data);
    run();
});

//
// FUNCTIONS --------------------------------------------------------------------------------------------------------------------------
//

// Uses the password passed in to connect to the Bamazon database
function connectSQL(password) {
    connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: password,
        database: "Bamazon"
    });

    connection.connect(function(err) {
        if (err) throw err;
    });
}

function run() {
    console.log('');

    inquirer.prompt([{

        type: 'list',
        name: 'arg',
        message: 'Please select a action',
        choices: ['View Product Sales by Department', 'Create New Department'],

    }]).then(function(answers) {
        if (answers.arg === 'View Product Sales by Department') {
            viewProductSalesByDepartment();
        } else {
            createNewDepartment();
        }
    });
}

function viewProductSalesByDepartment() {
    connection.query("SELECT * FROM departments", function(err, res) {
        var prodTable = [];

        for (var i = 0; i < res.length; i++) {
            prodTable.push({
                'Department ID': res[i].department_id,
                'Department Name': res[i].department_name,
                'Over Head Costs': res[i].over_head_costs.toFixed(2),
                'Total Sales': res[i].total_sales.toFixed(2),
                'Total Profit': (res[i].total_sales - res[i].over_head_costs).toFixed(2)
            });
        }

        console.log('');
        console.table(prodTable);
        run();
    });
}

function createNewDepartment() {
    inquirer.prompt([{

        name: 'deptName',
        message: 'Please enter a new department name',

    }, {

        name: 'overHead',
        message: 'Please enter the over head cost for the new department',
        validate: function(value) {
            var pass = value > 0;
            if (pass) {
                return true;
            }
            return 'Please enter a over head cost';
        },

    }]).then(function(answers) {
        var query = "INSERT INTO departments (department_name, over_head_costs, total_sales)" +
            " VALUES ('" + answers.deptName + "','" + answers.overHead + "', '0.00');";

        connection.query(query, function(err, res) {
            if (err) throw err;

            console.log('Department ' + answers.deptName + ' added successfully!');
            run();
        });
    });
}
