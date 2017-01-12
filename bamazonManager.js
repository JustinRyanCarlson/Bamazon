var mysql = require("mysql");
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
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
    }]).then(function(answers) {
        if (answers.arg === 'View Products for Sale') {
            viewProducts();
        } else if (answers.arg === 'View Low Inventory') {
            viewLowInventory();
        } else if (answers.arg === 'Add to Inventory') {
            addToInventory();
        } else {
            addNewProduct();
        }
    });
}


function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        var prodTable = [];

        for (var i = 0; i < res.length; i++) {
            prodTable.push({ 'Item ID': res[i].item_id, 'Product': res[i].product_name, 'Price': (res[i].price).toFixed(2), 'Quanity': res[i].stock_quanity });
        }

        console.log('');
        console.table(prodTable);
        run();
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quanity<=10", function(err, res) {
        if (err) throw err;
        var prodTable = [];

        for (var i = 0; i < res.length; i++) {
            prodTable.push({ 'Item ID': res[i].item_id, 'Product': res[i].product_name, 'Quanity': res[i].stock_quanity });
        }

        console.log('');
        console.table(prodTable);
        run();
    });
}

function addToInventory() {
    connection.query("SELECT item_id FROM products", function(err, res) {
        if (err) throw err;

        inquirer.prompt([{
            name: 'itemID',
            message: 'Please enter the ID for the item you would like to modify',
            validate: function(value) {
                var pass = value > 0 && value <= res.length;
                if (pass) {
                    return true;
                }
                return 'Please enter a valid Item ID';
            }
        }, {
            name: 'itemQuanity',
            message: 'Please enter the new total quanity for the selected item',
            validate: function(value) {
                var pass = value >= 0;
                if (pass) {
                    return true;
                }
                return 'Please enter a valid quanity';
            }
        }]).then(function(answers) {
            connection.query("UPDATE products SET stock_quanity=? WHERE item_id=?", [answers.itemQuanity, answers.itemID], function(err, res) {
                if (err) throw err;
                run();
            });
        });
    });
}

function addNewProduct() {

}
