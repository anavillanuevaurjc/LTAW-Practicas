//-- Modulos -->
const http = require('http');
const fs = require('fs');
const url = require('url');
const { count } = require('console');

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
  let Usuario = "";
  
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
    Usuario = myURL.searchParams.get('accesoUsuario');
    let contadorA = 0;
    //-- Recorrer el array de productos
    usuarios.forEach((element, index)=>{
      if (Usuario == element["nickname"]) {
        contadorA =+ 1;
      } 
    });
    //-- Si el contador es distinto de 0 -> usuario dado coincide con usuarios registrados
    if (contadorA != 0) {
      filename = "respuesta_login.html";
    }else{
      filename = "form-user.html";
    }
    
    
  }else if (myURL.pathname == "/carrito") {   //CARRITO
    filename = "respuesta_carrito.html";                //-- FichRespuesta
    content_type = "text/html";
    
  }else if (myURL.pathname == "/acceso") {    //REGISTRO -> No es necesario
    filename = "index.html";                             //-- FichRespuesta
    content_type = "text/html";
    //-- Datos recogidos del formulario
    let nombre = myURL.searchParams.get('nombre');
    let nombre_usuario = myURL.searchParams.get('nombre_usuario');
    let correo_electronico = myURL.searchParams.get('correo_electronico');

    //-- Modificacion JSON -> No es encesario
    //-- En la posicion [0] esta el 1er cliente
    //-- En la posicion [1] esta el 2º cliente 
    //-- ¿Como puedo introducir las variables del nuevo cliente?
    //-- Convertir la variable a cadena JSON
    //let myJSON = JSON.stringify(tienda);  
    //-- Guardarla en el fichero destino
    //fs.writeFileSync(fichero_JSON, myJSON);   
    
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
  console.log(Usuario);
  //--LECTURA ASINCRONA -->
  fs.readFile(filename, (err, data) => {
    console.log(filename);
    if (filename == "respuesta_login.html") {
      console.log(Usuario);
      console.log("SIU");
      //------------------------------
      const respuesta_login = fs.readFileSync('respuesta_login.html', 'utf-8');
      data = respuesta_login.replace("*NOMBRE*", Usuario);
      res.setHeader('Content-Type', content_type);
      res.write(data);
      return res.end();
    }
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
    res.write(data);  
    res.end();      
  });  
});

server.listen(PUERTO);