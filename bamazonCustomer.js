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
        inquire(prodTable);
    });

}


function inquire(itemsArr) {
    inquirer.prompt([{

        name: 'itemID',
        message: 'Please enter the ID for the item you would like to purchase',
        validate: function(value) {
            var pass = value > 0 && value <= itemsArr.length;
            if (pass) {
                return true;
            }
            return 'Please enter a valid Item ID';
        }

    }, {

        name: 'quanity',
        message: 'How many units would you like to purchase?',
        validate: function(value) {
            var pass = value > 0 && value % 1 === 0;
            if (pass) {
                return true;
            }
            return 'Please enter a valid quanity to purchase';
        }

    }]).then(function(answers) {

        connection.query("SELECT stock_quanity, price, total_sales FROM products WHERE item_id=?", [answers.itemID], function(err, res) {
            var newQuanity = res[0].stock_quanity - answers.quanity;
            var priceForID = res[0].price;
            var totalCost = (answers.quanity * priceForID).toFixed(2);
            var totalSales = parseFloat(totalCost) + parseFloat(res[0].total_sales);

            if (newQuanity < 0) {
                console.log('There is not enough stock for the quanity you chose please try again');
                console.log('Current quanity for Item ID ' + answers.itemID + ' is ' + res[0].stock_quanity);
                run();
            } else {
                connection.query("UPDATE products SET stock_quanity=? WHERE item_id=?", [newQuanity, answers.itemID], function(err, res) {
                    if (err) throw err;

                    connection.query("UPDATE products SET total_sales=? WHERE item_id=?", [totalSales, answers.itemID], function(err, res) {
                        if (err) throw err;
                        console.log('Thank you for your order!\nYour total cost was $' + totalCost + '\n');
                        run();
                    });

                });
            }
        });
    });
}
