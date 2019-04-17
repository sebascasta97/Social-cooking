var instanciar = true;
var identificador = 0;
var div1;
var div2;
var br1;
var br2;
var inputNombre;
var inputCantidad;
var contador;
var list;
var files;
var reader;
var imagenes = [];
var receta = new Object();
var usuario = new Object();
usuario =
    {

        'Nombre': "",
        'Correo': "",
        'img': "",
        'IdTipoUsu': "",
        'Id_Usuario': ""
    };

window.onload = cargarUsuario();


function cargarUsuario() {
    

    var parametro = window.location.search.substr('?').split('=');
    var correo = parametro[1];
    
    $.getJSON('/api/Usuario?correo=' + correo + "&confirmacion=" + true, function (data) {
        console.log("es lo que recoge=" + data)
        usuario = data;
        document.getElementById("nombreUsuario").innerHTML = "<img src=" + usuario.img + " id='images' >" + usuario.Nombre;
        //document.getElementById("images").src =; usuario.img;


    });

}

function guardarDatos() {

    //trabajo bajo el supuesto de que los campos estan llenos
    var ingredientes = [];
    var img=[];
    var nombreReceta = document.getElementById('nombreReceta');
    var ingrediente = document.getElementById('nombre');
    var cantidadIngrediente = document.getElementById('cantidad');
    var idiomas = document.getElementById('listaIdiomas');
    var imagen = document.getElementById('files');
    var descripcion = document.getElementById('descripcionReceta');
    var pasoApaso = document.getElementById('pasosReceta');
    var categoria = document.getElementById('listaCategorias');
    ingredientes[0] = { ingrediente: "", cantidad: "" };
    ingredientes[0].ingrediente = document.getElementById('nombreIngrediente').value;
    ingredientes[0].cantidad = document.getElementById('cantidadIngrediente').value;
    var j = 1;
    var i;
    if (ingrediente != null)
    {
        for (i = 1; i < ingrediente.childNodes.length; i += 2) {
            ingredientes[j] = { ingrediente: "", cantidad: "" };
            ingredientes[j].ingrediente = ingrediente.childNodes[i].value;
            ingredientes[j].cantidad = cantidadIngrediente.childNodes[i].value;
            j++;
        }
    }
   
    for (var k = 0; k < imagen.files.length; k++) {
        ConvertirBase64(imagen.files[k]);
        img[k] = imagen.files[k];
    }


    receta =
        {
            'Nombre': nombreReceta.value,
            'correo_usu': usuario.Correo,
            'ingrediente': ingredientes,
            'Idioma': idiomas.value,
            'Descripcion': descripcion.value,
            'PasoApaso': pasoApaso.value,
            'Categoria': categoria.value,
            'imagenes': imagenes,
            'imgs':img
        };
    GuardarReceta(receta);

}

function GuardarReceta(receta) {
    receta = JSON.stringify(receta);
    $.ajax({
        url: "/api/receta",
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        data: receta,
        success: function (receta) {
            swal("Receta agregada satisfactoriamente", "Oprime ok para continuar", "success");
            $("#exampleModalCenter").modal('hide');

        },
        error: function (request, message, error) {
            swal("Receta no agregada", "warning");
        }
    });
}
function ConvertirBase64(file) {
    var lectorImg = new FileReader();
    lectorImg.readAsDataURL(file);
    lectorImg.onload = function () {
        console.log(lectorImg.result);
        imagenes.push(lectorImg.result);


    };
    lectorImg.onerror = function (error) {
        console.log('Hubo un error: ', error);

    };
}

//Funcion para agregar campos de nombre y cantidad en la ventana modal.
function agregarCampos() {
  
  

  if(instanciar=== true)
  {
      div1 = document.createElement("DIV");
      div1.setAttribute("class", "form-group col-md-6");
      div1.setAttribute("id", "nombre");
      document.getElementById("Ingredientes").appendChild(div1);

      div2 = document.createElement("DIV");
      div2.setAttribute("class", "form-group col-md-6");
      div2.setAttribute("id", "cantidad");
      document.getElementById("Ingredientes").appendChild(div2);
      instanciar= false;

}
  
//Agregar espacios entre cada campo.
  br1 = document.createElement("BR");
  document.getElementById("nombre").appendChild(br1);

  br2 = document.createElement("BR");
  document.getElementById("cantidad").appendChild(br2);

//Agregar atributos a cada campo.
  inputNombre = document.createElement("INPUT");
  inputNombre.setAttribute("type", "text");
  inputNombre.setAttribute("class", "form-control");
  inputNombre.setAttribute("required", "required");
  inputNombre.setAttribute("id", "campoNombre"+identificador);
  document.getElementById("nombre").appendChild(inputNombre);

  inputCantidad = document.createElement("INPUT");
  inputCantidad.setAttribute("type", "number");
  inputCantidad.setAttribute("class", "form-control");
  inputCantidad.setAttribute("required", "required");
  inputCantidad.setAttribute("id", "campoCantidad"+identificador);
  document.getElementById("cantidad").appendChild(inputCantidad);
  identificador++;
   
  
}

//Funcion para eliminar campos de nombre y cantidad en la ventana modal. 
function eliminarCampos() {

  contador = document.getElementById("nombre").childElementCount;

  list = document.getElementById("nombre");
  list.removeChild(list.childNodes[contador-1]);

  list = document.getElementById("cantidad");
  list.removeChild(list.childNodes[contador-1]);

  list = document.getElementById("nombre");
  list.removeChild(list.childNodes[contador-2]);

  list = document.getElementById("cantidad");
  list.removeChild(list.childNodes[contador-2]);

  identificador--;

 
}

//agregar Imágenes

function archivo(evt) {
  files = evt.target.files; // FileList object
  
    //Obtenemos la imagen del campo "file". 
    for (var i = 0, f; f = files[i]; i++) {  
        document.getElementById("list").innerHTML = "";
       //Solo admitimos imágenes.
       if (!f.type.match('image.*')) {
            continue;
       }
   
       reader = new FileReader();
       
       reader.onload = (function(theFile) {
           return function(e) {
           // Creamos la imagen.
                  document.getElementById("list").innerHTML += ['<img class="thumb" src="', e.target.result,'" title="', escape(theFile.name), '"/>'].join('');
           };

       })(f);

       reader.readAsDataURL(f);
   }
}
         
  document.getElementById('files').addEventListener('change', archivo, false);

function limpiarBusqueda() {
    var item = document.getElementById('recetasxNombre');
    item.innerHTML = "";
}
    

function buscarxNombre()
{
    
    limpiarBusqueda();
    var search = document.getElementById('buscarReceta').value;

    //(String nombre, bool validar)
    $.getJSON('/api/receta?nombre=' + search + "&validar=" + true, function (data) {
        var ContendorRecetas = document.getElementById("recetasXNombre");
        if (data == "") {
            swal("No se encontró la receta :(", "Intenta con otra :)", "warning");
            

        }
        else { 
        $.each(data, function (recetaobtenidas, recActual) {
            {
               
                $("#recetasxNombre").append("\
                    <div class='col-md-3 col-sm-6 wow fadeInUp card ' > \
                        <div class='team-thumb'> \
                            <img src='images/chef1.jpg' class='img-responsive' alt='Team'> \
                                <div class='team-des'> \
                                    <h6>"+recActual.Nombre+"</h6> \
                                    <h4>"+ recActual.Categoria+"</h4> \
                                    <ul class='social-icon'> \
                                        <li><a href='#' class='fa fa-facebook'></a></li> \
                                        <li><button type='button' class='btn btn-primary' id='btnComentar' onclick=" + recActual.Id_receta +" data-toggle='modal' data-target='#exampleModalCenter6'>Ver Mas</button></li> \
                                    </ul> \
                               </div> \
                        </div> \
                </div> \
                   <div class='encima' aria-hidden='true'> \
                    <div class='modal fade' id ='exampleModalCenter6' tabindex='-1' role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'> \
                    <div class='modal-dialog modal-dialog-centered' role='document'> \
                        <div class='ventanaFormulario'> \
                            <div class='encabezadoFormulario'> \
                                <h5 class='tituloFormulario' id='titulo'>"+recActual.Nombre+"</h5> \
                            </div> \
                                <form method='dialog'> \
                                <div class='cuerpoFormulario'> \
                                    <div class='form-group'> \
                                        <label for='recipient-name' class='alinear'>Nombre de la Receta</label> \
                                        <input type='text' class='form-control' id='nombreReceta' required> \
                                        </div> \
                                        <!-- lista de Idiomas --> \
                                        <div class='form-group'> \
                                            <label for='exampleFormControlSelect1'>Idioma</label> \
                                            <select class='form-control' id='listaIdiomas' required> \
                                                <option value='' disabled selected>Selecciona un Idioma</option> \
                                                <option>Español</option> \
                                                <option>Inglés</option> \
                                                <option>Francés</option> \
                                                <option>Italiano</option> \
                                            </select> \
                                        </div> \
                                        <div class='form-group'> \
                                            <label for='exampleFormControlSelect1'>Categoría</label> \
                                            <select class='form-control' id='listaCategorias' required> \
                                                <option value='' disabled selected>Selecciona una Categoría</option> \
                                                <option>Vegetariana</option> \
                                                <option>Comida Rápida</option> \
                                                <option>Comida Italiana</option> \
                                                <option>Desayuno</option> \
                                            </select> \
                                        </div> \
                                        <!-- campos de nombre y cantidad de ingredientes --> \
                                        <div class='form-group'> \
                                            <label for='recipient-name' class='col-form-label'>Ingredientes</label> \
                                            <hr> \
                                        </div> \
                                            <!-- campo nombre de ingrediente --> \
                                        <div class='form-row' id='Ingredientes'> \
                                                <div class='margen col-md-6'> \
                                                    <label for='inputEmail4'>Nombre</label> \
                                                    <input type='text' class='form-control' id='nombreIngrediente' required> \
                                            </div> \
                                                    <!-- campo cantidad de ingrediente --> \
                                            <div class='margen col-md-6'> \
                                                        <label for='inputPassword4'>Cantidad</label> \
                                                        <input type='number' class='form-control' id='cantidadIngrediente' required> \
                                            </div> \
                                                    </div> \
                                                    <!-- botones agregar y eliminar campos de cantidad y nombre --> \
                                        <button onclick='agregarCampos()' class='btn btn-primary margenBoton'>Agregar</button> \
                                                    <button onclick='eliminarCampos()' class='btn btn-danger margenBoton'>Eliminar</button> \
                                                    <hr> \
                                                        <!-- campo de texto descripción--> \
                                        <div class='form-group'> \
                                                            <label for='exampleFormControlTextarea1' class='alinear'>Descripción</label> \
                                                            <textarea class='form-control' id='descripcionReceta' rows='3' required></textarea> \
                                                        </div> \
                                                        <!-- campo de texto paso a paso --> \
                                        <div class='form-group'> \
                                                            <label for='exampleFormControlTextarea1' class='alinear'>Paso a Paso</label> \
                                                            <textarea class='form-control' id='pasosReceta' rows='3' required></textarea> \
                                                        </div> \
                                                        <!-- obtener imagenes --> \
                                        <div class='form-group'> \
                                                            <label for='exampleFormControlFile1'>Imágenes</label> \
                                                            <input type='file' id='files' name='files[]' multiple><br> \
                                                                <output id='list'></output> \
                                        </div>\
                                    </div>\
                                                            <!-- Parte final del formulario --> \
                                    <div class='modal-footer' id='finalFormulario'> \
                                                                <button type='button' class='btn btn-danger' data-dismiss='modal' id='btnCerrarModal'>Cerrar</button> \
                                                                <button type='submit' class='btn btn-primary' id='btnAgregarReceta'>Agregar Receta</button> \
                                                            </div> \
                                </form> \
                            </div> \
                                                </div> \
                                            </div>\
                                        </div>");
                
                console.log("1" + recActual.Id_receta);
                console.log("2" + recActual.Categoria);
                console.log("3" + recActual.Descripcion);
                console.log("4" + recActual.Idioma);
                console.log("5" + recActual.Nombre);
                console.log("6" + recActual.correo_usu);
                console.log("7" + recActual.imagenes);
            }


            });

        }

    });
}

function buscarXCategoria(categoria) {
    limpiarBusqueda();
    $.getJSON('/api/receta?categoria=' + categoria, function (data) {
        var ContendorRecetas = document.getElementById("recetasXNombre");
        $.each(data, function (recetaobtenidas, recActual) {
            {

                $("#recetasxNombre").append("\
                    <div class='col-md-3 col-sm-6 wow fadeInUp card ' > \
                        <div class='team-thumb'> \
                            <img src='images/chef1.jpg' class='img-responsive' alt='Team'> \
                                <div class='team-des'> \
                                    <h6>"+ recActual.Nombre + "</h6> \
                                    <h4>"+ recActual.Categoria + "</h4> \
                                    <ul class='social-icon'> \
                                        <li><a href='#' class='fa fa-facebook'></a></li> \
                                        <li><button type='button' class='btn btn-primary' id='btnComentar' onclick=" + recActual.Id_receta + " data-toggle='modal' data-target='#exampleModalCenter2' >Ver Mas</button></li> \
                                    </ul> \
                               </div> \
                        </div> \
                </div>");
                console.log("1" + recActual.Id_receta);
                console.log("2" + recActual.Categoria);
                console.log("3" + recActual.Descripcion);
                console.log("4" + recActual.Idioma);
                console.log("5" + recActual.Nombre);
                console.log("6" + recActual.correo_usu);
                console.log("7" + recActual.imagenes);
            }


        });

    });
}
function signOut() {
    GoogleAuth.signOut();

}
