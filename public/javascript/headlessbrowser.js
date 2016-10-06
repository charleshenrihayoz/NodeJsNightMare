/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var socket = io.connect('http://localhost:8080');

function showFunctions (tableau)
{
    var list = JSON.parse(tableau);
    
    for (var i = 0; i < list.length; i++)
    {
        $(".list_function").append("<button class='buttonfunction' onclick='addFunctions(\""+list[i]+"\")'>"+list[i]+"</button>");
    }
}

var numberFunction = 0;
function addFunctions (functions)
{
    var first = functions.indexOf("(");
    var last = functions.indexOf(")");
    var virgule = functions.indexOf(",");
    var blocname = "bloc"+numberFunction;
    $(".constructor").append("<div id='"+blocname+"' class='blockfunction'>\n\
<p><i>"+numberFunction+"  </i><label class='namefunction'>"+functions+"</label></p></div>");
    
    if (first + 1 !== last)
    {
        $("#"+blocname).append("<input></input>");
        if (virgule !== -1)
        {
             $("#"+blocname).append("<input></input>");
        }
    }
    $("#"+blocname).append("<p><i class='removebtn fa fa-trash' aria-hidden='true'></i></p>");

    
    numberFunction++;
}
$(document).ready(function () {
   

        //socket.emit('message', 'renderPage ---' + $url);
        //  console.log("ok");
   
    socket.on('message', function (message) {

        console.log("call");
        showFunctions(message);

        
    });
    
    $(".removebtn").click(function(){
        console.log("erase");
});

$('.constructor').on( "click", ".removebtn", function() {
    $(this).parent().parent().remove();
    numberFunction--;
    
});    
 
    socket.on('list_function', function (message) {

        showFunctions(message);

        
    });



});