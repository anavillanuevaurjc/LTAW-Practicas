const http = require('http');

const PUERTO = 8080;

//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {

  console.log("Petición recibida")

  //-- Hayppy server. Generar respuesta
  //-- Código: todo ok
  //Establecer el codigo de respuesta
  res.statusCode = 200;
  //Establecer el codigo respuesta humano
  res.statusMessage = "OK :-)";
  //Añadir la cabecera indicada
  res.setHeader('Content-Type', 'text/plain');
  //Escribir informacion en el cuerpo del mensaje
  res.write("Soy el happy server\n");
  //Terminar y enviar mensaje
  res.end()

});

server.listen(PUERTO);

console.log("Ejemplo 4. Happy Server listo!. Escuchando en puerto: " + PUERTO);