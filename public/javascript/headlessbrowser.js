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

function showFunctions(tableau)
{
    var list = JSON.parse(tableau);

    for (var i = 0; i < list.length; i++)
    {
        $(".list_function").append("<button class='buttonfunction' onclick='addFunctions(\"" + list[i] + "\")'>" + list[i] + "</button>");
    }
}

var numberFunction = 0;
function addFunctions(functions)
{
    var first = functions.indexOf("(");
    var last = functions.indexOf(")");
    var virgule = functions.indexOf(",");
    var blocname = "bloc" + numberFunction;
    $(".constructor").append("<div id='" + blocname + "' class='blockfunction'>\n\
<p><i class='numberfunction'>" + numberFunction + "  </i><label class='namefunction'>" + functions + "</label></p></div>");

    if (first + 1 !== last)
    {
        $("#" + blocname).append("<input></input>");
        if (virgule !== -1)
        {
            $("#" + blocname).append("<input></input>");
            var newString = functions.substr(virgule);
            if (newString.indexOf(",") !==-1)
            {
                $("#" + blocname).append("<input></input>");
            }
        }
    }
    $("#" + blocname).append("<p><i class='button removebtn fa fa-trash' aria-hidden='true'></i></p>");
    $("#" + blocname).append("<p><i class='button upbtn fa fa-arrow-up' aria-hidden='true'></i></p>");
    $("#" + blocname).append("<p><i class='button downbtn fa fa-arrow-down' aria-hidden='true'></i></p>");



    numberFunction++;
}

function addVariableString ()
{
    $(".vos_variables").append("<div class='string'>"+
                        "<h4>string/int</h4>"+
                        "<label> Name </label> <input name='name' value='name'>"+
                        "<label> Value </label><input name='value' value='value'>"+
                        "<p><i class='button removebtn fa fa-trash' aria-hidden='true'></i></p>"+
                    "</div>");
}


function addVariableImage ()
{
    $(".vos_variables").append( "<div class='image'>"+
                        "<h4>image</h4>"+
                        "<label> Name </label> <input name='name' value='name'>"+
                        "<input type='file' name='pic' accept='image/*'>"+
                        "<p><i class='button removebtn fa fa-trash' aria-hidden='true'></i></p>"+
                    "</div>");
}
$(document).ready(function () {


    //socket.emit('message', 'renderPage ---' + $url);
    //  console.log("ok");

    
    socket.on('list_function', function (message) {

        showFunctions(message);


    });


    $('.constructor').on("click", ".upbtn", function () {
        var id = $(this).parent().parent().attr('id');
        if ($("#" + id).prev('.blockfunction').length !== 0)
        {

            
            var numberother = $("#" + id).prev('.blockfunction').find(".numberfunction").text();

            var mynumber = $("#" + id + " .numberfunction").text();

            $("#" + id).prev('.blockfunction').find(".numberfunction").text(mynumber);
            $("#" + id + " .numberfunction").text(numberother);
            $("#" + id).insertBefore($("#" + id).prev('.blockfunction'));

        }

    });

    $('.constructor').on("click", ".downbtn", function () {
        var id = $(this).parent().parent().attr('id');
        if ($("#" + id).next('.blockfunction').length !== 0)
        {
           
            var numberother = $("#" + id).next('.blockfunction').find(".numberfunction").text();

            var mynumber = $("#" + id + " .numberfunction").text();

            $("#" + id).next('.blockfunction').find(".numberfunction").text(mynumber);
            $("#" + id + " .numberfunction").text(numberother);
            $("#" + id).insertBefore($("#" + id).next('.blockfunction'));
        }

    });


    

    $('.constructor').on("click", ".removebtn", function () {
        $(this).parent().parent().remove();
        numberFunction--;

    });
    
    $('.vos_variables').on("click", ".removebtn", function () {
        $(this).parent().parent().remove();
        

    });

    


});