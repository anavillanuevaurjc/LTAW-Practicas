// Permite implementar clientes y servidores

const http = require('http'); // Permite acceder a los elementos del modulo http


const PUERTO = 8080;

//-- Imprimir informacion sobre el mensaje de solicitud
function print_info_req(req) {

    console.log("");
    console.log("Mensaje de solicitud");
    console.log("====================");
    //Tipo de solicitud
    console.log("Método: " + req.method);
    //Nombre del recurso solicitado -> / -> indica recurso raiz
    console.log("Recurso: " + req.url);
    //Version del protocolo HTTP usado por el cliente
    console.log("Version: " + req.httpVersion)
    console.log("Cabeceras: ");

    //-- Recorrer todas las cabeceras disponibles
    //-- imprimiendo su nombre y su valor
    for (hname in req.headers)
      console.log(`  * ${hname}: ${req.headers[hname]}`);

    //-- Construir el objeto url con la url de la solicitud
    const myURL = new URL(req.url, 'http://' + req.headers['host']);
    console.log("URL completa: " + myURL.href);
    console.log("  Ruta: " + myURL.pathname);
}

//-- SERVIDOR: Bucle principal de atención a clientes
//Objeto con el mensaje vacio creado al recibir solicitud -> RES
//Objeto que contiene el mensaje al recibir mensaje de solicitud -> REQ
const server = http.createServer((req, res) => {

  //-- Petición recibida
  //-- Imprimir información de la petición
  print_info_req(req);

  //-- Si hay datos en el cuerpo, se imprimen
  req.on('data', (cuerpo) => {

    //-- Los datos del cuerpo son caracteres
    req.setEncoding('utf8');

    console.log("Cuerpo: ")
    console.log(` * Tamaño: ${cuerpo.length} bytes`);
    console.log(` * Contenido: ${cuerpo}`);
  });

  //-- Esto solo se ejecuta cuando llega el final del mensaje de solicitud
  req.on('end', ()=> {
    console.log("Fin del mensaje");

    //-- Hayppy server. Generar respuesta
    res.setHeader('Content-Type', 'text/plain');
    res.write("Soy el happy server\n");
    res.end()
  });

});

server.listen(PUERTO);

console.log("Ejemplo 1. Happy Server listo!. Escuchando en puerto: " + PUERTO);