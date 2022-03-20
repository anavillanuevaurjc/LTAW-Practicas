//-- Modulos -->
const http = require('http');
const fs = require('fs');
const url = require('url');

//-- Puerto -->
const PUERTO = 9090;

//-- JSON --> 

//-- Nombre del fichero JSON a leer
const fichero_JSON = "tienda.json";
//-- Leer el fichero JSON
const tienda_JSON = fs.readFileSync(fichero_JSON);
//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_JSON);
const productos = tienda[0].productos;
const usuarios = tienda[1].usuarios;
const nu_usuarios = usuarios.length;
const pedidos = tienda[2].pedidos;
//console.log("Productos tienda: " +  productos.length);
//console.log("Usuarios tienda: " +  usuarios.length);
//console.log("Pedidos tienda: " + pedidos.length);


//-- Servidor -->
console.log("Escuchando...");

const server = http.createServer((req, res) => {
  const myURL = new URL(req.url, 'http://' + req.headers['host']);
  //console.log("");
  //console.log("Método: " + req.method);
  //console.log("Recurso: " + req.url);
  //console.log("  Ruta: " + myURL.pathname);
  //console.log("  Parametros: " + myURL.searchParams);
  //console.log(productos[0]["nombre"]);
  
  if (myURL.pathname == "/"){
    filename = "index.html"
    content = (myURL.pathname).split(["."])[1]
    if (content == "jpg" || content == "JPG") {
      content_type = "image/" + "jpeg";
    }else if (content == "png" || content == "PNG") {
      content_type = "image/" + "png";
    }else if (content == "gif"){
      content_type = "image/" + "gif";
    }else{
      content_type = "text/" + content;
    }
    //Funciona correctamente
    //console.log(productos[0]["nombre"]);
    //productos[0]["nombre"] = "AMAIA"
    //console.log(productos[0]["nombre"]);
    //-- Convertir la variable a cadena JSON
    //let myJSON = JSON.stringify(tienda);  
    //-- Guardarla en el fichero destino
    //fs.writeFileSync(fichero_JSON, myJSON);   

  }else if (myURL.pathname == "/procesar") {  //LOGIN                  //-- FichRespuesta
    content_type = "text/html";
    let Usuario = myURL.searchParams.get('accesoUsuario');
    //-- Recorrer el array de productos
    let contadorA = 0;
    usuarios.forEach((element, index)=>{
      if (Usuario == element["nickname"]) {
        contadorA =+ 1;
      } 
    });
    
    if (contadorA != 0) {
      filename = "respuesta_login.html";
    }else{
      filename = "form-user.html";
    }
    
  }else if (myURL.pathname == "/carrito") {   //CARRITO
    filename = "respuesta_carrito.html";                //-- FichRespuesta
    content_type = "text/html";
    
  }else if (myURL.pathname == "/acceso") {    //REGISTRO
    filename = "index.html";                             //-- FichRespuesta
    content_type = "text/html";
    //console.log("ENTRA AL FORMULARIOOOOOOOOOOOOO");
    //-- Datos recogidos del formulario
    let nombre = myURL.searchParams.get('nombre');
    let nombre_usuario = myURL.searchParams.get('nombre_usuario');
    let correo_electronico = myURL.searchParams.get('correo_electronico');
    //-- Modificacion JSON
    //console.log(nu_usuarios);
    //console.log(usuarios.length);
    //usuarios[usuarios.length - 1] = usuarios[0];
    
    //console.log(usuarios[usuarios.length - 1]["nickname"]);
    //console.log(usuarios[usuarios.length - 1]["nickname"]);
    //usuarios[usuarios.length - 1]["nickname"] = nombre_usuario;
    //usuarios[usuarios.length - 1]["tipo"] = "normal";
    //usuarios[usuarios.length - 1]["nombre"] = nombre;
    //usuarios[usuarios.length - 1]["email"] = correo_electronico;

    //-- Convertir la variable a cadena JSON
    let myJSON = JSON.stringify(tienda);  
    //-- Guardarla en el fichero destino
    fs.writeFileSync(fichero_JSON, myJSON);   




    
  }else{
    content = (myURL.pathname).split(["."])[1]
    if (content == "jpg" || content == "JPG") {
      content_type = "image/" + "jpeg";
    }else if (content == "png" || content == "PNG") {
      content_type = "image/" + "png";
    }else if (content == "gif"){
      content_type = "image/" + "gif";
    }else{
      content_type = "text/" + content;
    }
    filename = "." + myURL.pathname;
  }
  //console.log("URL busqueda correcta" + filename);
  //console.log("Tipo de contenido " + content);

  //--LECTURA ASINCRONA -->
  fs.readFile(filename, (err, data) => {
    if (err) {
        console.log('Error')
        let code = 404;
        let code_msg = "Not Found";
        data = fs.readFileSync('error.html','utf8');
        content = (myURL.pathname).split(["."])[1]
        
        if (content == "jpg" || content == "JPG") {
          content_type = "image/" + "jpeg";
        }else if (content == "png" || content == "PNG") {
          content_type = "image/" + "png";
        }else if (content == "gif"){
          content_type = "image/" + "gif";
        }else{
          content_type = "text/" + content;
        }

        res.statusCode = code;
        res.statusMessage = code_msg;
        res.setHeader('Content-Type', content_type);
        res.write(data);
        return res.end();
    }

    console.log(content_type)
    let code = 200;
    let code_msg = "OK";
    res.statusCode = code;
    res.statusMessage = code_msg;
    res.write(data);  //Su ausencia da lugar a error 
    res.end();      //Su ausencia da lugar a error 
  });  
});

server.listen(PUERTO);