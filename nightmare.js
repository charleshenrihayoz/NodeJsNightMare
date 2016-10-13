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
    'upload(selector, base64)': upload,
    'click(selector)': click,
    'type(selector, text)': type,
    'waitFor(selector)': waitFor,
    'waitTime(time)': waitTime,
    'getUrl()': getUrl,
    'getScreenShot()': getScreenShot,
    'back()': back,
    'if(text, text, number)': "if",
    'insert(selector, text)': insert,
    'forward()': forward,
    'check(selector)': check,
    'uncheck(selector)': uncheck,
    'select(selector, value)': select,
    'end()': end,
    'replaceAllStringWith(oldText,newText)': replaceAllStringWith

};
var defaultwait = 2000;

function * run() {
    try {
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
                    
                    //console.log(object['functionname'] + "(" + list_variable[object['parameters'][0]] + "," + list_variable[object['parameters'][1]] + ")");
                    yield list_function[object['functionname']](list_variable[object['parameters'][0]], list_variable[object['parameters'][1]]);
                    break;
                  case 3:
                    // yield nightmare.type(object['parameters'][0], object['parameters'][1]);
                    
                    //console.log(object['functionname'] + "(" + list_variable[object['parameters'][0]] + "," + list_variable[object['parameters'][1]] + ")");
                    yield list_function[object['functionname']](list_variable[object['parameters'][0]], list_variable[object['parameters'][1]],list_variable[object['parameters'][2]]);

                    break;
            }
            ;
            yield waitTime (defaultwait);
            socket.emit ("complete", compteur);
            compteur ++;
        } catch (e)
        {
            
            console.log(e);
            socket.emit ("messageNightmare", e);
            socket.emit ("error", compteur);
            if (nightmare != null)
    {
        yield nightmare.end();
    }
            compteur ++;
             console.log("fini");
            return false;
            
        }

    }

    
    console.log("fini");
    if (nightmare != null)
    {
        yield nightmare.end();
    }
    
     socket.emit ("messageNightmare", "finish");
    // Aller la page (URL to GET)

    /*   yield list_function['click']('#placeHolder-search-btn');
     yield list_function['waitTime'](5000);
     console.log(yield list_function['exist']('input #search-box'));
     // yield goTo('http://www.intimategadgets.com/3-vibrators');
     yield list_function['type']('input #search-box', 'github nightmare \u000d');
     yield list_function['wait']('#main');
     yield list_function['end']();*/
        return true;
     } catch (e)
        {
             socket.emit ("messageNightmare", e);
            console.log(e);
            return (false);
        }
};

/*urlsToGet.forEach(function (url) {
 nightmare.goto(url).catch(function (error) {
 console.error('Search failed:', error);
 });
 
 });*/


var nightmare;
var list_variable;
var socket;
var list_execution;

function parseFunctions (list_exe)
{
  
    for (var i =0; i < list_exe.length; i++)
    {
         var object = list_exe[i];
         if (object["functionname"] =="if(text, text, number)")
         {
             if (object["paramaters"][0] === object["parameters"][1])
             {
                 list_exe.splice(index, 1);
             }
             else
             {
                 list_exe.splice(index, parseInt(object["parameters"][2]));
             }
         }
    }
    return list_exe;
    
}
 function  startNightMare(list_exe, list_var, callback, io)
{
    list_variable = list_var;
    socket = io;
    list_execution = parseFunctions(list_exe);
    
    if (nightmare != null)
    {
        nightmare.end();
    }
    nightmare = Nightmare({show: true})
            .useragent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    vo(run).then(out => callback(out));
}
exports.startNightmare = startNightMare;

function returnlist_function ()
{
    return list_function;
}
exports.returnlist_function = returnlist_function;
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


var fs = require('fs');

function upload(element, base64)
{
    var p1 = new Promise(function(resolve, reject) {
  resolve("Succès !");
  // ou
  // reject("Erreur !");
});
    if (base64.length > 0)
    {
    var image = base64;
    var extension = base64.substr(base64.indexOf("/")+1, base64.indexOf(";")-base64.indexOf("/")-1);
    
    var data = image.replace(/^data:image\/\w+;base64,/, '');
    var path = __dirname + "temp."+extension;
    return new Promise(function(resolve, reject) {
    fs.writeFile(path, data, {encoding: 'base64'}, function(err){
         if (err) reject(err);
               else resolve(data);
            });
       
    }).then(function(results) {
       return nightmare.upload(element, path);
});
   
}
return p1;
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


