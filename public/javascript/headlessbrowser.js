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
        $(".list_function").append("<button class='buttonfunction' onclick='addFunctions(\"" + list[i] + "\", [])'>" + list[i] + "</button>");
    }
}

var numberFunction = 0;
function addFunctions(functions, params)
{
    var first = functions.indexOf("(");
    var last = functions.indexOf(")");
    var virgule = functions.indexOf(",");
    var blocname = "bloc" + numberFunction;
       
    $(".constructor").append("<div id='" + blocname + "' class='blockfunction'>\n\
</div>");
 $("#" + blocname).append("<div class='indication'><i class='fa fa-check' aria-hidden='true'></i></div><div class='menubloc'><i class='button removebtn fa fa-trash' aria-hidden='true'></i>"+
            "<i class='button upbtn fa fa-arrow-up' aria-hidden='true'></i>"+
            "<i class='button downbtn fa fa-arrow-down' aria-hidden='true'></i></div>"+
            "<p><i class='numberfunction'>" + numberFunction + "  </i><label class='namefunction'>" + functions + "</label></p>");
    
    
    if (first + 1 !== last)
    {

        if (params.length > 0)
        {
            $("#" + blocname).append("<input value ='" + params_list[params[0]] + "'></input>");
        } else

        {
            $("#" + blocname).append("<input></input>");
        }
        if (virgule !== -1)
        {
            if (params.length > 1)
            {
                $("#" + blocname).append("<input value ='" + params_list[params[1]] + "'></input>");
            } else

            {
                $("#" + blocname).append("<input></input>");
            }

            var newString = functions.substr(virgule + 1);
            if (newString.indexOf(",") !== -1)
            {
                if (params.length > 2)
                {
                    $("#" + blocname).append("<input value ='" + params_list[params[2]] + "'></input>");
                } else

                {
                    $("#" + blocname).append("<input></input>");
                }
            }
        }
    }





    numberFunction++;
}

function previewFile(id) {
    console.log(id);
    var file = document.querySelector('#' + id + ' input[type=file]').files[0];

    console.log(file);
    var preview = $('#' + id);
    var reader = new FileReader();

    reader.addEventListener("load", function () {

        preview.find("img").attr("src", reader.result);
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}
var compteurVariable = 0;
function addVariableString(name = "name", value ="value")
{
    $(".vos_variables").append("<div id = 'variable" + compteurVariable + "' class='string'>" +
            "<h4>string/int</h4>" +
            "<label> Name </label> <input id='name' name='name' value='"+name+"'>" +
            "<label> Value </label><input id='value' name='value' value='"+value+"'>" +
            "<p><i class='button removebtn fa fa-trash' aria-hidden='true'></i></p>" +
            "</div>");
    compteurVariable++;
}
var params_list;
function load(tab) {
    compteurVariable = 0;
    numberFunction = 0;
    var name = tab[0].name;
    $("#savename").val(name);
    $(".constructor div").remove();
    $(".vos_variables div").remove();
    var functions_list = $.parseJSON(tab[0].functions_list);

    params_list = $.parseJSON(tab[0].params_list);
    var var_list = JSON.parse(tab[0].variables_list);
   

    for (var i = 0; i < functions_list.length; i++)
    {

        var functionName = functions_list[i].functionname;
        var params = functions_list[i].parameters;

        addFunctions(functionName, params);
    }

    for (var index in var_list) {
        var attr = var_list[index];
        if (attr.substr(0, 4) === "data")
        {
           addVariableImage(index, attr);
        }
        else
            
        {
            addVariableString(index, attr);
        }
    }

}

function emitLoadCommand()
{
    var selectedName = $('#loadselect').find(":selected").text();
    socket.emit('loadScript', selectedName);
}

function save() {

    var data = codeGenerator(true);
    data.name = $('#savename').val();
    socket.emit('saveScript', data);
   socket.emit('list_script', data);
}

function execute () {
     $(".constructor .indication").each(function(element)
        {
        $(this).css("display","none");
        });
        
        $("#errormessage").text("");
    var data = JSON.stringify(codeGenerator(false));
    //console.log(data);
    socket.emit('executeNightmare', data);
}

function codeGenerator(save) {
    var list_variable = [];
    var list_execution = [];
    var list_entrance = {};
    $(".vos_variables .string").each(function (index) {
        var name = $(this).find('#name').val();
        var value = $(this).find('#value').val();
        list_entrance[name] = value;

    });
    $(".vos_variables .image").each(function (index) {
        var name = $(this).find('#name').val();

        var value = $(this).find('img').attr('src');
        list_entrance[name] = value;

    });
    $(".constructor .blockfunction").each(function (index) {

        var namefunction = $(this).find(".namefunction").text();

        var object = {'functionname': '', 'parameters': []};
        object.functionname = namefunction;
        $(this).find("input").each(function (index)
        {
            var str = $(this).val();

            if (str.indexOf("var_") !== -1)
            {
                if (!save)
                {
                    str = str.substring(4);
                    
                    str = list_entrance[str];
                    if (str != null)
                    {
                         //str = str.replace(/\\n/g,'\u000d');
                    }
                    else
                    {
                        str = "";
                    }
                       
                    
                   
                   

                }


            }
            var index = list_variable.push(str);

            object.parameters.push(index - 1);

        });

        list_execution.push(object);

    });

    var data = {};
    data.functions_list = list_execution;
    data.params_list = list_variable;
    data.variables_list = list_entrance;
    return data;


}

function showScriptToLoad(tab)
{
    $('#loadselect option').remove();
    for (var i = 0; i < tab.length; i++)
    {
        var obj = tab[i];
        console.log(obj);
        $('#loadselect').append($('<option>', {
            value: obj.name,
            text: obj.name
        }));
    }
}
function addVariableImage(name ="name", src ="")
{
    $(".vos_variables").append("<div id = 'variable" + compteurVariable + "'class='image'>" +
            "<h4>image</h4>" +
            "<label> Name </label> <input  id='name' name='name' value='"+name+"'>" +
            "<input class='file' type='file'  onchange='previewFile(\"variable" + compteurVariable + "\")' name='pic' accept='image/*'>" +
            "<p><i class='button removebtn fa fa-trash' aria-hidden='true'></i></p><img src='"+src+"' alt='picture'/>" +
            "</div>");
    compteurVariable++;
}
$(document).ready(function () {


    //socket.emit('message', 'renderPage ---' + $url);
    //  console.log("ok");


    socket.on('list_function', function (message) {


        showFunctions(message);


    });
     socket.on('messageNightmare', function (message) {


        $('#errormessage').text(message);


    });
    socket.on('complete', function (index) {
        var compt = 0;
       
        $(".constructor .indication").each(function(element)
        {
            
            if (compt<= index)
            {
                 console.log(index);
                $(this).css("display","block");
            }
            compt++;
        });
        


    });
    
    socket.on('loadScript', function (message) {


        load(JSON.parse(message));


    });

    socket.on('listScript', function (message) {

        showScriptToLoad(JSON.parse(message));



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
            $("#" + id).insertAfter($("#" + id).next('.blockfunction'));
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