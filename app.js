const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon',
    insecureAuth: true
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    // console.log('connected as id ' + connection.threadId);
});

//console log all items
function displayItems(func) {
    connection.query('SELECT * from products', (err, res) => {
        if (err) throw err;
        console.table(res);
    })
    setTimeout(func, 100); 
};

//checks sql inventory 
function checkInventory(id, quantity) {
    var query = () => {
        connection.query('SELECT STOCK, item_ID from PRODUCTS', (err, res) => {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                if (id == res[i].item_ID && res[i].STOCK >= quantity) {
                    return true;
                }; 
            }; 
        });
    }
    if (query === true) {
        return true; 
    }; 
};

displayItems(askCustomer);


function askCustomer() {
    inquirer.prompt([{
                type: 'input',
                message: 'Input the product ID',
                name: 'productID'
            },
            {
                type: 'input',
                message: 'How many would you like to buy?',
                name: 'quantity'
            }
        ])
        .then((res) => {
            // console.log(res); 
            if (checkInventory(Number(res.productID), Number(res.quantity))) {
                console.log('purchase succesful');
            } else {
                console.log('This item either does not exist or we do not have enough in stock')
            }; 
            keepShopping(); 
        })
        .catch((err) => console.log(err));
}; 

function keepShopping () {
    inquirer.prompt([{
        type: 'list', 
        message: 'do you want to keep shopping?', 
        choices: ['yes', 'no'],
        name: 'keepShopping'
    }]).then((res) => {
        if(res.keepShopping === 'yes') {
            displayItems(askCustomer)
        } else if (res.keepShopping === 'no') {
            console.log('goodbye')
        } else {
           console.log('please select one'); 
        }
    }).catch((err) => console.log(err)); 
};  
