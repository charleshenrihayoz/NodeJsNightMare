/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Nightmare = require('nightmare')
var nightmare = Nightmare({show: true})
        .useragent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25')

/*nightmare
 .goto('http://www.anibis.ch/fr/default.aspx')
 .type('input[name="ctl00$phlContent$ctlSearchbox$txtSearchText"]', 'restaurant ')
 .type('input[name="ctl00$phlContent$ctlSearchbox$txtSearchText"]', '\u000d')
 .wait(5000)
 
 .catch(function (error) {
 console.error('Search failed:', error);
 });*/
function ok ()
{
    console.log("ok");
}
nightmare.goto('https://www.google.ch/', ok)
.catch(function (error) {
    console.error('Search failed:', error);
});
console.log("wrote");
/*.exists('#lst-ib').then(function (result) {
    if (result === true)
    {
        console.log("wrote");
        return nightmare.type('#lst-ib', 'restaurant lille')
        .type('#lst-ib', '\u000d');
    }

})



        .catch(function (error) {
    console.error('Search failed:', error);
});*/





 