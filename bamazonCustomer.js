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
    connection.query("SELECT * FROM products", function(err, res) {
        var prodTable = [];

        for (var i = 0; i < res.length; i++) {
            prodTable.push({ 'Item ID': res[i].item_id, 'Product': res[i].product_name, 'Price': (res[i].price).toFixed(2) });
        }

        console.log('');
        console.table(prodTable);
        inquire();

    });

}


function inquire() {
    inquirer.prompt([{
        name: 'itemID',
        message: 'Please enter the ID for the item you would like to purchase'
    }, {
        name: 'quanity',
        message: 'How many units would you like to purchase?'
    }]).then(function(answers) {

        connection.query("SELECT stock_quanity, price FROM products WHERE item_id=?", [answers.itemID], function(err, res) {
            var newQuanity = res[0].stock_quanity - answers.quanity;
            var priceForID = res[0].price;

            if (newQuanity < 0) {
                console.log('There is not enough stock for the quanity you chose please try again');
                console.log('Current quanity for ID ' + answers.itemID + ' is ' + res[0].stock_quanity);
                run();
            } else {
                connection.query("UPDATE products SET stock_quanity=? WHERE item_id=?", [newQuanity, answers.itemID], function(err, res) {
                    if (err) throw err;
                    var totalCost = (answers.quanity * priceForID).toFixed(2);
                    console.log('Thank you for your order!\nYour total cost was $' + totalCost + '\n');
                    run();
                });
            }
        });
    });
}
