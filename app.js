var mysql = require("mysql");
var inquirer = require('inquirer');
var fs = require('fs');
var quanityForID;
// currently not working need to make it wait for response before connection
fs.readFile('local_server_password.txt', 'utf8', function(err, data) {
    if (err) throw err;
    connectSQL(data);
});


function connectSQL(password) {
    var connection = mysql.createConnection({
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

        connection.query("SELECT stock_quanity FROM products WHERE item_id=?", [answers.itemID], function(err, res) {
            quanityForID = res[0].stock_quanity;
            // not needed 
            console.log(quanityForID - answers.quanity);
        });

        var newQuanity = quanityForID - answers.quanity;
        // i think this is running before the response comes back from 
        if (newQuanity < 0) {
            console.log('There is not enough stock for the quanity you chose please try again');
            console.log('Current quanity for ID ' + answers.itemID + ' is ' + quanityForID);
            run();
        } else {
            connection.query("UPDATE products SET stock_quanity=? WHERE item_id=?", [newQuanity, answers.itemID], function(err, res) {
                if (err) throw err;
            });
            run();
        }
    });
}
