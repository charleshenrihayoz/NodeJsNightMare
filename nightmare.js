/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Nightmare = require('nightmare');
require('nightmare-upload')(Nightmare);

var vo = require('vo');

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


function * run() {
    
    yield nightmare.cookies.clearAll();
    var compteur = 0;
    for (var i = 0; i < list_execution.length; i++)
    {
        try {
            object = list_execution[i];

            switch (object['parameters'].length) {
                case 0:
                    console.log(object['functionname']);
                    yield (list_function[object['functionname']])();
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
            socket.emit ("complete", compteur);
            compteur ++;
        } catch (e)
        {
            yield nightmare.end();
            console.log(e);
            return (false);
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
                return true;
}
;

/*urlsToGet.forEach(function (url) {
 nightmare.goto(url).catch(function (error) {
 console.error('Search failed:', error);
 });
 
 });*/


var nightmare;
var list_variable;
var socket;
var list_execution;

 function  startNightMare(list_exe, list_var, callback, io)
{
    list_variable = list_var;
    socket = io;
    list_execution = list_exe;
    if (nightmare != null)
    {
        nightmare.end();
    }
    nightmare = Nightmare({show: true})
            .useragent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    vo(run).then(out => callback(out));
}
exports.startNightmare = startNightMare;


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

function getScreenShot ()
{
    return vo(ScreenShot).then(function (out){return out});
}
function * ScreenShot()
{
    var screen = yield nightmare.screenshot();
    
    socket.emit ("screenshot", screen);
    return screen;
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


