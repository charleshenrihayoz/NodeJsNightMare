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
var vo = require('vo');
var nightmare = Nightmare({show: true})
        .useragent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25')


function *run() {
    var listProducts = [];
  // Aller la page (URL to GET)
    yield nightmare.goto('http://www.intimategadgets.com/3-vibrators');
    if (productByProduct)
    {
        
    }
    else
    {
        var exist =  yield nightmare.exists(blocProducts);
        if (exist)
        {
            
        }
        else
        {
            console.log ("le bloc produits n'existe pas");
        }
    }
    
    
    console.log(exist);
    if (exist)
    {
        yield nightmare.type('#lst-ib', 'restaurant lille');
    }
    var message = yield nightmare.evaluate(function() {
        //[...]
        return "hello";
    });
    nightmareMessage(message);
};

vo(run)(function(err){
    console.log('done');
});


/*urlsToGet.forEach(function (url) {
    nightmare.goto(url).catch(function (error) {
        console.error('Search failed:', error);
    });

});*/



