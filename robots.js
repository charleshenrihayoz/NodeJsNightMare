/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var nightmare = require('./nightmare');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sweetdanauto'
});

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log(err.stack + " Error connecting database ... nn");
    }
});


server.listen(8080);
app.get('/', function (req, res) {
    res.render('index.ejs');
});

app.get('/automationPetitesAnnonces', function (req, res) {
    res.render('automationPetitesAnnonces.ejs');
});



var list_execution = [
    {'functionname': 'goto(url)', 'parameters': [0]},
    {'functionname': 'getScreenShot()', 'parameters': []},
    {'functionname': 'click(selector)', 'parameters': [1]},
    {'functionname': 'waitTime(time)', 'parameters': [7]},
    {'functionname': 'type(selector, text)', 'parameters': [2, 3]},
    {'functionname': 'type(selector, text)', 'parameters': [4, 5]},
    {'functionname': 'click(selector)', 'parameters': [6]},
    {'functionname': 'waitFor(selector)', 'parameters': [8]},
    {'functionname': 'click(selector)', 'parameters': [9]},
    {'functionname': 'clickLinkWithText(text)', 'parameters': [10]},
    {'functionname': 'waitTime(time)', 'parameters': [7]},
    {'functionname': 'clickLinkWithText(text)', 'parameters': [11]},
    {'functionname': 'waitTime(time)', 'parameters': [7]},
    {'functionname': 'clickLinkWithText(text)', 'parameters': [12]},
    {'functionname': 'waitTime(time)', 'parameters': [7]},
    {'functionname': 'click(selector)', 'parameters': [13]},
    {'functionname': 'waitTime(time)', 'parameters': [7]},
    {'functionname': 'upload(selector, path)', 'parameters': [14, 15]},
    {'functionname': 'waitTime(time)', 'parameters': [7]},
    {'functionname': 'upload(selector, path)', 'parameters': [16, 17]},
    {'functionname': 'waitTime(time)', 'parameters': [7]},
    {'functionname': 'upload(selector, path)', 'parameters': [18, 19]},
    {'functionname': 'waitTime(time)', 'parameters': [7]},
    {'functionname': 'end()', 'parameters': []}
];

var list_variable = ['http://www.anibis.ch/fr/default.aspx',
    '#ctl00_ContentPlaceHolder1_ctlHomeLinks_hypInsert',
    '#ctl01_ContentPlaceHolder1_ctlLogin_tbxUsername_tbxField', 'badblock',
    '#ctl01_ContentPlaceHolder1_ctlLogin_tbxPassword_tbxField', 'badblock9092',
    '#ctl01_ContentPlaceHolder1_ctlLogin_btnLogin_btn',
    2000,
    '#ctl00_MemberContent_ctlStepNew_tbxSearch',
    '#ctl00_MemberContent_ctlStepNew_hypAllCategories',
    'Animaux',
    'Chiens',
    'croisés',
    '#ctl00_MemberContent_dashboard_hypPhotos',
    'input[name="image"]', '\\images\\1.png',
    'input[name="image"]', '\\images\\2.png',
    'input[name="image"]', '\\images\\3.png'];

var pileDAppel = [];
io.on('connection', function (socket) {

    console.log('a user connected');
    
   
    socket.on('executeNightmare', function (tableau) {
        tableau = JSON.parse(tableau);
        //console.log(tableau);
        if (nightmareInExecution)
        {
            var temp = {};
            temp.functions_list = tableau["functions_list"];
            temp.params_list = tableau["params_list"];
            pileDAppel.push(temp);
        }
        else
        {
            nightmareInExecution = true;
            nightmare.startNightmare(tableau["functions_list"], tableau["params_list"], callBackNightMare, io);
        }
        
        // On récupère le pseudo de celui qui a cliqué dans les variables de session

    });

    socket.on('saveScript', function (data) {
      
        connection.query("DELETE FROM scripts WHERE name = '"+data.name+"'", function (err, rows, fields) {
             connection.query('INSERT INTO scripts (fk_cat, functions_list, params_list, variables_list, name) VALUES ("'+
                1+'",'+  connection.escape(JSON.stringify(data.functions_list))+','+  connection.escape(JSON.stringify(data.params_list))+','+ connection.escape(JSON.stringify(data.variables_list))+',"'+ data.name+'")', function (err, rows, fields) {
            console.log(err);

        });

        });
       
    });
    
    socket.on ('updateProduct', function (data) {
        var dat = JSON.parse(data);
        
        connection.query('UPDATE products SET data='+  connection.escape(JSON.stringify(dat.data))+' WHERE id='+ parseInt(dat.id), function (err, rows, fields) {
            console.log(err);

        });
       
    });
    socket.on ('deleteProduct', function (data) {
        
        
        connection.query('DELETE FROM products WHERE id="'+ parseInt(data)+'"', function (err, rows, fields) {
            console.log(err);

        });
       
    });
    socket.on('saveProduct', function (data) {
      
        connection.query('INSERT INTO products (fk_categorie, data) VALUES ('+
                1+','+  connection.escape(data)+')', function (err, rows, fields) {
            console.log(err);

        });
       
    });
    
    socket.on('getMyProducts', function (data) {
        //var data = JSON.parse(data);
         connection.query("SELECT * FROM products", function (err, rows, fields) {
            
         
           socket.emit("products", JSON.stringify(rows));
        });
       
    });
    
    socket.on('loadScript', function(data)
    {
       
        connection.query("SELECT * FROM scripts WHERE name='"+data+"'", function (err, rows, fields) {
            
         
           socket.emit("loadScript", JSON.stringify(rows));
        });
    });

   socket.on('list_script', function(data)
    {
        emitList_Script ();
    });

 
    emitList_Script ();

    emitList_Function();
    

});
var nightmareInExecution = false;
function emitList_Script ()
{
    connection.query('SELECT name from scripts', function (err, rows, fields) {
            io.emit("listScript", JSON.stringify(rows));

        });
}

function emitList_Function ()
{
    var list_function = nightmare.returnlist_function();
    var tableauString = [];
    for (var key in list_function) {
        tableauString.push(key);
    }
    io.emit('list_function', JSON.stringify(tableauString));
}

//nightmare.startNightmare(list_execution, list_variable, callBackNightMare, io);

function callBackNightMare(retour)
{
    
    console.log("callback " + retour);
    io.emit("nightmareFinish", retour);
    if (pileDAppel.length> 0)
    {
        nightmareInExecution = true;
        nightmare.startNightmare(pileDAppel[0].functions_list, pileDAppel[0].params_list, callBackNightMare, io);
        pileDAppel.splice(0,1);
    }
    else
    {
        nightmareInExecution = false;
    }
}










