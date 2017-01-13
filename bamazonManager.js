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

// Uses inquirer to list choices to the user. Depending on what the user chooses, the corresponding function is then called.
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

// Queries the database for all its information from the products table then places selected row data into a object and
// pushes that object to an array to be printed to the console as a table. 
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

// Queries the database for all its information where the stock quanity is less than or
// equal to 10. It then uses the same method as the viewProducts function to store the information
// and print it to the console as a table.
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

// Queries the database for the item_id column of the products table. This is used to make sure
// the user cannot select a item id outside of how many exist in the database. Now that I look at this
// I see a bug where a item is deleted from the database where the length of the res object would be 1
// less than the last added item (ie. 10 items user deletes item id 2, now there are 9 items but an item with
// an item_id of 10 exists). I will fix this in the future. The users answers are then used to update the stock quanity
// for the selected item id.
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

// Uses inquirer to ask the user for some input. Once input is recieved, this data is used to add a new product
// to the database.
function addNewProduct() {
    inquirer.prompt([{

        name: 'productName',
        message: 'Please enter the name for the product you would like to add',

    }, {

        name: 'departmentName',
        message: 'Please enter the department name for the new product',

    }, {

        name: 'price',
        message: 'Please enter the price for the new product',
        validate: function(value) {
            var pass = value >= 0;
            if (pass) {
                return true;
            }
            return 'Please enter a valid price';
        }

    }, {

        name: 'quanity',
        message: 'Please enter the total quanity for the new product',
        validate: function(value) {
            var pass = value >= 0 && value % 1 === 0;
            if (pass) {
                return true;
            }
            return 'Please enter a valid quanity';
        }

    }]).then(function(answers) {
        var query = "INSERT INTO products (product_name, department_name, price, stock_quanity, product_sales)" +
            " VALUES ('" + answers.productName + "','" + answers.departmentName + "','" +
            answers.price + "','" + answers.quanity + "', '0.00');";

        connection.query(query, function(err, res) {
            if (err) throw err;
            console.log(answers.productName + ' successfully added');
            run();
        });
    });
}
