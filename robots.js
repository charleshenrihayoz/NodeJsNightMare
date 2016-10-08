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


server.listen(8080);
app.get('/', function (req, res) {
    res.render('index.ejs');
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

io.on('connection', function (socket) {
    console.log('a user connected');
    var tableauString = [];
    for (var key in list_function) {
        tableauString.push(key);
    }
    socket.emit('list_function', JSON.stringify(tableauString));

});
nightmare.startNightmare(list_execution, list_variable, callBackNightMare, io);

function callBackNightMare (retour)
{
    console.log("callback "+ retour)
    io.emit("nightmareFinish", retour);
}
io.on('executeNightmare', function (tableau) {
    nightmare.startNightmare(tableau["list_execution"], tableau["list_variable"], callBackNightMare, io);
    // On récupère le pseudo de celui qui a cliqué dans les variables de session

});










