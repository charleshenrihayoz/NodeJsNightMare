/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var socket = io.connect('http://localhost:8080');

function loadProduct(tableau)
{
    for (var i = 0; i < tableau.length; i++)
    {
        var object = tableau[i];
        console.log(object);
        var data = JSON.parse(object.data);
        console.log(data);
        $("#produits").append('<div class="product"><h2>' + object.id + '</h2>' +
                '<p> Titre <input id="title" name="title" value="' + data.title + '"></p>' +
                '<p> Description <textarea id="description" name ="description" rows="8" cols="50">' +
                data.description +
                '</textarea></p>' +
                '<p>Prix <input id="price" name="price" value="' + data.price + '"></p>' +
                '<p><i class="removebtn fa fa-trash" aria-hidden="true"></i>    <i class="savebtn fa fa-floppy-o" aria-hidden="true"></i></p>' +
                "<p><span><i class='removeimg fa fa-trash' aria-hidden='true'></i><img id='img1' src='" + data.image1 + "'/><input class='file' type='file' name='pic' accept='image/*'></span><span><i class='removeimg fa fa-trash' aria-hidden='true'></i><img id='img2' src='" + data.image2 + "'/><input class='file' type='file'  name='pic' accept='image/*'></span></p>" +
                '</div>');


    }
}

function addProduct() {
    $("#produits").append('<div class="product"><h2>/</h2>' +
            '<p> Titre <input id="title" name="title" value="Titre"></p>' +
            '<p> Description <textarea id="description" name ="description" rows="8" cols="50">' +
            'Description' +
            '</textarea></p>' +
            '<p>Prix <input id="price" name="price" value="100"></p>' +
            '<p><i class="removebtn fa fa-trash" aria-hidden="true"></i>    <i class="savebtn fa fa-floppy-o" aria-hidden="true"></i></p>' +
            "<p><span><i class='removeimg fa fa-trash' aria-hidden='true'></i><img id='img1' src=''/><input class='file' type='file' name='pic' accept='image/*'></span><span><i class='removeimg fa fa-trash' aria-hidden='true'></i><img id='img2' src=''/><input class='file' type='file'  name='pic' accept='image/*'></span></p>" +
            '</div>');
}

function publish(scriptToPublish) {
    socket.emit("loadScript", scriptToPublish);

}

function generateFunc(tab)
{

    var functions_list = $.parseJSON(tab[0].functions_list);


    $("#produits .product").each(function (index) {
        var params_list = $.parseJSON(tab[0].params_list);

        var titre = $(this).find('#title').val();
        var description = $(this).find('#description').val();
        var price = $(this).find('#price').val();
        var image1 = $(this).find('#img1').attr('src');
        var image2 = $(this).find('#img2').attr('src');
        for (var i = 0; i < params_list.length; i++)
        {
            if (params_list[i] === "var_description")
            {
                
                
                //description = description.replace(new RegExp('\\r?\\n','g'), '\u000d');
                
                
                params_list[i] = description;
            }
            if (params_list[i] === "var_titre")
            {
                params_list[i] = titre;
            }
            if (params_list[i] === "var_price")
            {
                params_list[i] = price;
            }
            if (params_list[i] === "var_image1")
            {
                params_list[i] = image1;
            }
            if (params_list[i] === "var_image2")
            {
                params_list[i] = image2;
            }
        }
        var data = {};
        data.functions_list = functions_list;
        data.params_list = params_list;
        socket.emit('executeNightmare', JSON.stringify(data));
      
    });
}

$(document).ready(function () {
    socket.emit('getMyProducts', "hey");
    socket.on('loadScript', function (message) {
        generateFunc(JSON.parse(message));
    });
    socket.on('products', function (message) {


        loadProduct(JSON.parse(message));


    });

    $('#produits').on("click", ".removebtn", function () {

        var id = $(this).parent().parent().find("h2").text();
        if (id === '/')
        {
            $(this).parent().parent().remove();
        } else
        {
            socket.emit('deleteProduct', id);
            $(this).parent().parent().remove();

        }
    });
    $('#produits').on("click", ".removeimg", function () {

        var id = $(this).parent().find("img").attr('src', '');

    });
    $('#produits').on("change", ".file", function () {

        console.log("ok");

        var file = $(this)[0].files[0];

        console.log(file);
        var preview = $(this).parent().find("img");
        var reader = new FileReader();

        reader.addEventListener("load", function () {

            preview.attr("src", reader.result);
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    });
    $('#produits').on("click", ".savebtn", function () {

        var id = $(this).parent().parent().find("h2").text();
        var data = {};
        data.title = $(this).parent().parent().find("#title").val();
        data.description = $(this).parent().parent().find("#description").val();
        data.price = $(this).parent().parent().find("#price").val();
        data.image1 = $(this).parent().parent().find('#img1').attr('src');
        data.image2 = $(this).parent().parent().find('#img2').attr('src');
        console.log(data);
        if (id === '/')
        {
            socket.emit('saveProduct', JSON.stringify(data));
            $(this).parent().parent().find("h2").text("*");
        } else
        {
            var object = {};
            object.data = data;
            object.id = id;
            socket.emit('updateProduct', JSON.stringify(object));
        }
    });
});
