/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var urlsToGet = ["http://www.intimategadgets.com/3-vibrators"];
var productByProduct = false;
var blocProducts = "";
var formsToGet = [];
var pageToClick = "";
var category = "";
var Nightmare = require('nightmare');
require('nightmare-upload')(Nightmare);
var vo = require('vo');
var nightmare = Nightmare({show: true})
        .useragent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25')
var list_execution = [
    {'functionname': 'goto', 'parameters': [0]},
    {'functionname': 'click', 'parameters': [1]},
    {'functionname': 'waitTime', 'parameters': [2]},
    {'functionname': 'exist', 'parameters': [3]},
    {'functionname': 'type', 'parameters': [4, 5]},
    {'functionname': 'waitTime', 'parameters': [6]},
    {'functionname': 'end', 'parameters': []}
];

var list_variable = ['http://yahoo.com', '#placeHolder-search-btn', 2000, '#search-box','#search-box','github nightmare \u000d',2000];
var list_function = {
    'goto': goTo,
    'exist': exist,
    'upload': upload,
    'click': click,
    'type': type,
    'waitFor': waitFor,
    'waitTime': waitTime,
    'getUrl': getUrl,
    'getScreenShot': getScreenShot,
    'back': back,
    'insert': insert,
    'forward': forward,
    'check': check,
    'uncheck': uncheck,
    'select': select,
    'end': end,
    'replaceAllStringWith':replaceAllStringWith

};


function * run() {
    try {
        for (var i = 0; i < list_execution.length; i++)
        {
            object = list_execution[i];
            console.log(object['functionname']);
            switch (object['parameters'].length) {
                case 0:
                    yield list_function[object['functionname']]();
                    break;
                case 1:
                    yield list_function[object['functionname']](list_variable [object['parameters'][0]]);
                    break;
                case 2:
                    // yield nightmare.type(object['parameters'][0], object['parameters'][1]);
                    yield list_function[object['functionname']](list_variable[object['parameters'][0]], list_variable[object['parameters'][1]]);

                    break;
            }
            ;

        }
    } catch (e)
    {
        console.log(e);
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
vo(run)(function (err) {
    console.log(err);
});
/*urlsToGet.forEach(function (url) {
 nightmare.goto(url).catch(function (error) {
 console.error('Search failed:', error);
 });
 
 });*/
function replaceAllStringWith (value, replace)
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
    return nightmare.wait(time);
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


