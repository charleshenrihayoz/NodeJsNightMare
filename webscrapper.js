/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var urlToGet = "http://iherb.com/psoriasis";
var productsToGet = [];



var formsToGet =
        {
            "Titre": "#name",
            "Description": ".inner-content .row",
            "Prix": "#price"
        };

var fields = ["Titre", "Description", "Prix"];
var imageToGet = ['.prod-im-sm-front a'];

var formstoTranslate = ["Titre", "Description"];
var lang = ['fr', 'de'];
var category = "";
var utf8 = require('utf8');
var cheerio = require("cheerio");
var request = require("request");
var json2csv = require('json2csv');

/*var bt = require('bing-translate').init({
 client_id: 'nightmare',
 client_secret: 'rLz5NGyhxIySuIDj2Bij8GCpe9CubHGQXIHxRNl97xE='
 });*/

var credentials = {
    clientId: 'nightmare', /* Client ID from the registered app */
    clientSecret: 'rLz5NGyhxIySuIDj2Bij8GCpe9CubHGQXIHxRNl97xE='  /* Client Secret from the registered app */
}
var translator = require('bingtranslator');
var vo = require('vo');
if (productsToGet.length > 0)
{
    productsGetter(productsToGet);
} else
{
    getAllProducts(urlToGet);
}

function getAllProducts(url)
{
    var list_products = [];
    request({
        uri: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
            'Accept': 'text/html;q=0.9,*/*;q=0.8',
            'Accept-Language': 'fr'
        }
    }, function (error, response, body) {
        var $ = cheerio.load(body);

        $(".link-overlay").each(function () {
            var link = $(this);

            list_products.push(link.attr("href"));

        });

        productsGetter(list_products)
    });

}
var list_product = [];
function getProduct(url, call)
{
    request({
        uri: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
            'Accept': 'text/html;q=0.9,*/*;q=0.8',
            'Accept-Language': 'fr'
        }
    }, function (error, response, body) {
        var $ = cheerio.load(body);

        var object = {}
        for (var key in formsToGet) {
            var temp = formsToGet[key];
            object[key] = $(temp).first().text();

        }
        object.image = [];
        object.url = response.request.uri.href;
        var compteur = 0;
        for (var key in imageToGet)
        {
            var elem = imageToGet[key];
            $(elem).each(function () {
                var src = $(this).attr("src");
                if (typeof src == 'undefined')
                {

                    src = $(this).attr("href");
                }
                console.log("src " + src);
                if (typeof src != 'undefined')
                {


                    var chemin = "\\images\\" + object.Titre + compteur + ".png";
                    object.image.push(chemin);

                    download(src, chemin, function () {
                        // console.log('done');
                    });
                    compteur++;
                }

            });



        }
        list_product.push(object);
        nbreElement--;
        console.log(nbreElement);
        if (nbreElement === 0)
        {
            treatment();
        }




    });
}

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        //console.log('content-type:', res.headers['content-type']);
        //console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(__dirname + filename)).on('close', callback);
    });
};

function jsonText(tableau)
{
    var string = JSON.stringify(tableau);
    string = string.replace(/\\r/g, ' \r ');
    string = string.replace(/\\t/g, ' ');

    string = string.replace(/\\n/g, ' \n ');
    return string;
}
var tableauLanguage = {};
function treatment()
{
    var intouche = list_product;

    var string = jsonText(list_product);
    writeFile("en.txt", string);
    writeCSV (intouche);
    tableauLanguage = {};
    /*lang.forEach(function (element, index)
     {
     tableauLanguage[element] = {
     'number': 0,
     'tableau': null
     };
     traduction(intouche, element);
     });*/

    //console.log(string);

    /* bt.translate('This hotel is located close to the centre of Paris.', 'en', 'fr', function (err, res) {
     console.log(res['translated_text']);
     });*/
}
;

var nbreIteration;
//hehehtest
function traduction(tableau, language)
{

    nbreIteration = formstoTranslate.length * tableau.length;
    tableauLanguage[language]["number"] = nbreIteration;

    tableauLanguage[language]["tableau"] = JSON.parse(JSON.stringify(tableau));
    tableauLanguage[language]["tableau"].forEach(function (object, indexTab)
    {

        formstoTranslate.forEach(function (element, indexForm)
        {
            /*var string = object [element];
             string = string.replace(/\\r/g, ' ');
             string = string.replace(/\\t/g, ' ');
             
             string = string.replace(/\\n/g, ' ');*/
            //var string = utf8.encode(object[element]);
            var string = object[element];


            callBingTranslate(string, indexTab, element, language);

        });

    });
}

function callBingTranslate(string, indexTab, indexForm, language)
{
    translator.translate(credentials, string, 'en', language, function (err, translated) {
        if (err || translated.search("TranslateApiException") != -1) {
            console.log('error ' + translated);
            callBingTranslate(string, indexTab, indexForm, language);
            return;
        } else
        {
            var string = translated;
            string = string.replace(/\\u000a/g, ' \n ');
            string = string.replace(/\\u000d/g, ' \r ');

            //string = string.replace(/\\n/g, ' \n ');
            console.log(tableauLanguage[language]["number"] + " Translate ");
            tableauLanguage[language]["tableau"][indexTab][indexForm] = string;
            tableauLanguage[language]["number"]--;
            if (tableauLanguage[language]["number"] === 0)
            {
                writeFile(language + ".txt", jsonText(tableauLanguage[language]["tableau"]));
            }
        }


    });
}

function transformationEnCsv(tableau)
{
    var interval = ";";
    var string = "";
    for (var i = 0; i < fields.length; i++)
    {
        if (i != 0)
        {
            string += interval + fields[i];
        } else
        {
            string += fields[i];
        }
    }

    for (var i = 0; i < tableau; i++)
    {
        string += '\n';
        for (var x = 0; x < fields; x++)
        {
            var fie = fields[x];
            if (i != 0)
            {
                string += interval + tableau[i][fie];
            } else
            {
                string += tableau[i][fie];
            }
        }
    }
    
    return string;
}

var fs = require('fs');
function writeCSV (tableau)
{
    var csv = transformationEnCsv(tableau);

    fs.writeFile('file.csv', csv, function (err) {
        if (err)
            throw err;
        console.log('file saved');
    });
}
function writeFile(filename, string)
{

    
    fs.writeFile(__dirname + "\\" + filename, string, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}


var list_object;
var nbreElement;
function productsGetter(list_product)
{
    var length = list_product.length;
    nbreElement = length;
    list_product.forEach(function (element, index)
    {
        getProduct(element);


    });
}