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

var imageToGet = [];

var formstoTranslate = [];
var lang = [];
var category = "";

var cheerio = require("cheerio");
var request = require("request");
var bt = require('bing-translate').init({
    client_id: '4eca816f-4f90-44d5-a0e6-c54f326a3e22',
    client_secret: 'sX5poQpwvT5eN2o1Dyehiqg13d66tC0OeXOZFWEfAcE'
});
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
        var compteur = 0;
        for (var key in imageToGet)
        {
            var temp = imageToGet[key];
            $(temp).each(function (i, elem) {
                var src = $(this).attr("src");
                var chemin = object.Titre + compteur + ".png";
                object.image.push(chemin);
                download(src, chemin, function () {
                    console.log('done');
                });
                compteur++;
            });
        }
        list_product.push(object);
        if (call)
        {
            treatment();
        }




    });
}

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};


function treatment()
{
    var intouche = list_product;
    var string = JSON.stringify(intouche);
    string = string.replace(/\\r/g, ' ');
    string = string.replace(/\\t/g, ' ');

    string = string.replace(/\\n/g, ' \n ');
    writeFile("en.txt", string);
    lang.forEach(function (element, index)
    {
        traduction(intouche, element);
    });

    //console.log(string);

    /*bt.translate('This hotel is located close to the centre of Paris.', 'en', 'fr', function (err, res) {
     console.log(res['translated_text']);
     });*/
}
;
//hehehtest
function traduction(tableau, language)
{
    tableau.forEach(function (object, index)
    {
        formstoTranslate.forEach(function (element, index)
        {

            var string = object[element];
        });
        
    });
}

function writeFile(filename, string)
{
    var fs = require('fs');
    fs.writeFile(__dirname + "\\" + filename, string, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}


var list_object;
function productsGetter(list_product)
{
    var length = list_product.length;
    list_product.forEach(function (element, index)
    {
        if (length === index + 1)
        {
            getProduct(element, true);
        } else

        {
            getProduct(element, false);
        }

    });
}