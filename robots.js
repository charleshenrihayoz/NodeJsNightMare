/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Nightmare = require('nightmare');
require('nightmare-upload')(Nightmare);

var vo = require('vo');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


server.listen(8080);
app.get('/', function (req, res) {
    res.render('index.ejs');
});

var list_function = {
    'goto(url)': goTo,
    'clickLinkWithText(text)': clickLinkWithText,
    'exist(selector)': exist,
    'upload(selector, path)': upload,
    'click(selector)': click,
    'type(selector, text)': type,
    'waitFor(selector)': waitFor,
    'waitTime(time)': waitTime,
    'getUrl()': getUrl,
    'getScreenShot()': getScreenShot,
    'back()': back,
    'insert(selector, text)': insert,
    'forward()': forward,
    'check(selector)': check,
    'uncheck(selector)': uncheck,
    'select(selector, value)': select,
    'end()': end,
    'replaceAllStringWith(oldText,newText)': replaceAllStringWith

};

io.on('connection', function (socket) {
    console.log('a user connected');
    var tableauString =[];
    for (var key in list_function) {
        tableauString.push(key);
    }
    socket.emit('list_function', JSON.stringify(tableauString));

});

io.on('message', function (message) {
    // On récupère le pseudo de celui qui a cliqué dans les variables de session

});

function startNightMare()
{
    if (nightmare != null)
    {
        nightmare.end();
    }
    var nightmare = Nightmare({show: true})
            .useragent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    vo(run)(function (err) {
        console.log(err);
    });
}
var list_execution = [
    {'functionname': 'goto', 'parameters': [0]},
    {'functionname': 'click', 'parameters': [1]},
    {'functionname': 'waitTime', 'parameters': [7]},
    {'functionname': 'type', 'parameters': [2, 3]},
    {'functionname': 'type', 'parameters': [4, 5]},
    {'functionname': 'click', 'parameters': [6]},
    {'functionname': 'waitFor', 'parameters': [8]},
    {'functionname': 'click', 'parameters': [9]},
    {'functionname': 'clickLinkWithText', 'parameters': [10]},
    {'functionname': 'waitTime', 'parameters': [7]},
    {'functionname': 'clickLinkWithText', 'parameters': [11]},
    {'functionname': 'waitTime', 'parameters': [7]},
    {'functionname': 'clickLinkWithText', 'parameters': [12]},
    {'functionname': 'waitTime', 'parameters': [7]},
    {'functionname': 'click', 'parameters': [13]},
    {'functionname': 'waitTime', 'parameters': [7]},
    {'functionname': 'upload', 'parameters': [14, 15]},
    {'functionname': 'waitTime', 'parameters': [7]},
    {'functionname': 'upload', 'parameters': [16, 17]},
    {'functionname': 'waitTime', 'parameters': [7]},
    {'functionname': 'upload', 'parameters': [18, 19]},
    {'functionname': 'waitTime', 'parameters': [7]},
    {'functionname': 'end', 'parameters': []}
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







function * run() {

    yield nightmare.cookies.clearAll();
    for (var i = 0; i < list_execution.length; i++)
    {
        try {
            object = list_execution[i];

            switch (object['parameters'].length) {
                case 0:
                    console.log(object['functionname']);
                    yield list_function[object['functionname']]();
                    break;
                case 1:
                    console.log(object['functionname'] + "(" + list_variable [object['parameters'][0]] + ")");
                    yield list_function[object['functionname']](list_variable [object['parameters'][0]]);
                    break;
                case 2:
                    // yield nightmare.type(object['parameters'][0], object['parameters'][1]);
                    console.log(object['functionname'] + "(" + list_variable[object['parameters'][0]] + "," + list_variable[object['parameters'][1]] + ")");
                    yield list_function[object['functionname']](list_variable[object['parameters'][0]], list_variable[object['parameters'][1]]);

                    break;
            }
            ;
        } catch (e)
        {
            console.log(e);
        }

    }


    console.log("fini");

    // Aller la page (URL to GET)

    /*   yield list_function['click']('#placeHolder-search-btn');
     yield list_function['waitTime'](5000);
     console.log(yield list_function['exist']('input #search-box'));
     // yield goTo('http://www.intimategadgets.com/3-vibrators');
     yield list_function['type']('input #search-box', 'github nightmare \u000d');
     yield list_function['wait']('#main');
     yield list_function['end']();*/
}
;

/*urlsToGet.forEach(function (url) {
 nightmare.goto(url).catch(function (error) {
 console.error('Search failed:', error);
 });
 
 });*/

function clickLinkWithText(txt)
{
    return nightmare.evaluate(function (txt) {
        var temp = document.getElementsByTagName("a");

        var url = "bla";
        for (var i = 0; i < temp.length; i++)
        {
            var obj = temp[i];

            var innerHtml = obj.innerHTML;
            if (innerHtml.indexOf(txt) !== -1)
            {
                url = obj.getAttribute("href");
            }

        }

        return url;
    }, txt).then(function (link) {
        if (link !== "bla")
        {
            return nightmare.click('a[href^="' + link + '"]');
        }
    });
}
function replaceAllStringWith(value, replace)
{
    for (var i = 0; i < list_variable.length; i++)
    {
        list_variable[i].replace(value, replace);
    }
}

function end()
{

    return nightmare.end();
}
function insert(element, txt)
{
    return nightmare.insert(element, txt);
}
function goTo(url)
{
    return nightmare.goto(url);
}
function exist(element)
{
    return nightmare.exists(element);
}
function upload(element, path)
{
    path = __dirname + path;
    return nightmare.upload(element, path);
}
function click(element)
{
    return nightmare.click(element);
}
function type(element, txt)
{
    return nightmare.type(element, txt);
}
function waitFor(element)
{
    return nightmare.wait(element);
}
function waitTime(time)
{
    var timetemp = parseInt(time);
    return nightmare.wait(timetemp);
}

function getUrl()
{
    return nightmare.url();
}
function getScreenShot()
{
    return nightmare.screenshot();
}
function back()
{
    return nightmare.back();
}
function forward()
{
    return nightmare.forward();
}
function check(element)
{
    return nightmare.check(element)
}
function uncheck(element)
{
    return nightmare.uncheck(element)
}

function select(element, option)
{
    return nightmare.select(element, option);
}


