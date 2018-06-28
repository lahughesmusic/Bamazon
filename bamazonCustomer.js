var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});
 


connection.connect(function(err) {
    if (err) {
      console.error("err ");
    }
    productsList();
  });

function start(choice){
    inquirer.prompt([
        {
        name: 'ID',
        message: 'What is your Product ID number?',
        type: 'input',
        validate: function(value){
            if(isNaN(value) === false){
                return true;
            }
                return false;

            }
        }
    ]).then(function(answer){

           var itemId = parseInt(answer.ID);
           var item = doWeHaveIt(itemId, choice);
          
           if(item){
               howMany(item);
           }
           else{
               console.log('We do not have it')
               productsList();
           
              
           }
    
           



        })
    };

    function howMany(items){
        inquirer.prompt([
            {
            type: 'input',
            name: 'how_many',
            message: 'how many ya want?'
            }
        ])
            .then(function(err, howMany){
               
                var amount = parseInt(items.how_many)
                if (amount >  items.stock_quantity){
                    console.log('sorry, we are out!');
        
                    productsList();
                }
                else{
                    buyIt(items, amount);
                }
              
            })
    }

    function buyIt(items, amount){
        connection.query(
            "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
            [amount, items.item_id],
            function(err, res){
                
                console.log('you bought a ' + items.product_name + '!');
                productsList();
            }
        
            
        )
     
    }


    function productsList() {
        connection.query("SELECT * FROM products", function(err, res) {
          if (err) throw err;          
          console.log(res);
         
          start(res); 
         
        });
      }
    
    function doWeHaveIt(itemId, stock_quantity) {
        for (var i = 0; i < stock_quantity.length; i++) {
          if (stock_quantity[i].item_id == itemId) {
         
            return stock_quantity[i];
          }
        }
     return null;


    };


  


