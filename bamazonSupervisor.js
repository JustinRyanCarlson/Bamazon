var mysql = require('mysql');
var inquirer = require('inquirer');
var fs = require('fs');
require('console.table');
var connection;



fs.readFile('local_server_password.txt', 'utf8', function(err, data) {
    if (err) throw err;

    connectSQL(data);
    run();
});





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

}
