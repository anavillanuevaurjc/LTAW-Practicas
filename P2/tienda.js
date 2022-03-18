//-- Modulos -->
const http = require('http');
const fs = require('fs');
const url = require('url');

//-- Puerto -->
const PUERTO = 9090;

//-- HTML de la página de respuesta-->
//RESPUESTA = fs.readFileSync('respuesta_login.html', 'utf-8');

//-- JSON --> 
//const FICH_JSON = "tienda.json";
//const TIENDA_JSON = fs.readFileSync(FICH_JSON);
//const tienda = JSON.parse(TIENDA_JSON);
//let productos = tienda[0]['productos'];
//let usuarios = tienda[1]['usuarios'];


//-- Servidor -->
console.log("Escuchando...");

const server = http.createServer((req, res) => {
  const myURL = new URL(req.url, 'http://' + req.headers['host']);
  console.log("");
  console.log("Método: " + req.method);
  console.log("Recurso: " + req.url);
  console.log("  Ruta: " + myURL.pathname);
  console.log("  Parametros: " + myURL.searchParams);
  
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

  }else if (myURL.pathname == "/procesar") {
    filename = "respuesta_login.html";                  //-- FichRespuesta
    content_type = "text/html";
    //let Usuario = myURL.searchParams.get('nombre');
    //console.log("Usuario:" + Usuario)
    //content_type = "text/html";
    //data = fs.readFileSync('index.html', 'utf-8');
    
  }else if (myURL.pathname == "/carrito") {
    filename = "respuesta_carrito.html";                //-- FichRespuesta
    content_type = "text/html";
    
  }else if (myURL.pathname == "/acceso") {
    filename = "index.html";                             //-- FichRespuesta
    content_type = "text/html";
    
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