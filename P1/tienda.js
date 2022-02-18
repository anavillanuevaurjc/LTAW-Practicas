//-- Importar los modulos http, fs (obligatorios) y url (opcional)
const http = require('http');
const fs = require('fs');
const url = require('url');

//-- Definir el puerto a utilizar
const PUERTO = 9000;

//-- Crear el sevidor
const server = http.createServer((req, res)=>{

  console.log("Peticion Recibida");

  //Valores de respuesta por defecto
  let code = 200;
  let code_msg = "OK";

  //-- Analizar el recurso
  //-- Construir el objeto url con la url de la solicitud
  const url = new URL(req.url, 'http://' + req.headers['host']);
  console.log(url.pathname);

   //-- Cualquier recurso que no sea la página principal
  //-- genera un error
  if (url.pathname != '/') {
      code = 404;
      code_msg = "Not Found";
      page = pagina_error;
  }

    //-- Generar la respusta en función de las variables
    //-- code, code_msg y page
    res.statusCode = code;
    res.statusMessage = code_msg;
    res.setHeader('Content-Type','text/html');
    res.write(page);
    res.end();


});

//-- Activar el servidor
server.listen(PUERTO);

//-- Mensaje de inicio
console.log("Escuchando en el puerto" + PUERTO);