var mysql = require("mysql");
var inquirer = require('inquirer');
var fs = require('fs');
var quanityForID;
var connection;

fs.readFile('local_server_password.txt', 'utf8', function(err, data) {
    if (err) throw err;
    connectSQL(data);
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

run();



function run() {
    inquirer.prompt([{
        name: 'itemID',
        message: 'Please enter the ID for the item you would like to purchase'
    }, {
        name: 'quanity',
        message: 'How many units would you like to purchase?'
    }]).then(function(answers) {

        connection.query("SELECT stock_quanity, price FROM products WHERE item_id=?", [answers.itemID], function(err, res) {
            test(answers.itemID, answers.quanity, res[0].stock_quanity, res[0].price);
        });

        function test(answersItemID, answersQuanity, quanityForID, price) {
            var newQuanity = quanityForID - answersQuanity;

            if (newQuanity < 0) {
                console.log('There is not enough stock for the quanity you chose please try again');
                console.log('Current quanity for ID ' + answersItemID + ' is ' + quanityForID);
                run();
            } else {
                connection.query("UPDATE products SET stock_quanity=? WHERE item_id=?", [newQuanity, answersItemID], function(err, res) {
                    if (err) throw err;
                    var totalCost = answersQuanity * price;
                    console.log('Thank you for your order!\nYour total cost was $' + totalCost + '\n');
                    run();
                });
            }
        }

    });
}
