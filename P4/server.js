//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 9090;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-- Contador
var counter = 0;

//--Nuevo user
var new_user = false;

// PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  //
  path = __dirname + '/public/index.html';
  res.sendFile(path);
  //res.send('MINICHAT\n' + '<a href="/chat.html">Entrar</a>');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname + '/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  new_user = true;
  if (new_user == true){
    io.send("Nuevo usuario se ha unido al chat");
    socket.send("BIENVENIDO");
    new_user = false;
  }
  console.log('** NUEVA CONEXIÓN **'.yellow);
  counter = counter + 1;

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    counter = counter - 1;
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);
    let split_msg = Array.from(msg);
    if (split_msg[0] == "/"){
      console.log("socket.send");

      if (msg == "/list"){
        socket.send("Número de participantes: " + counter);
      }else if (msg == "/hello"){
        socket.send("Hello");
      }else if (msg == "/help") {
        let data = "Comandos: <br><br>/help -> Provoca la muestra la lista de comandos existentes <br><br>/hello -> Provoca un saludo por parte del servidor <br><br>/list -> Provoca la visualización de la cantidad de participantes <br><br>/date -> Provoca la visualización de la fecha";
        socket.send(data);
      }else if (msg == "/date") { 
        let date = new Date(Date.now());
        let data = "Fecha: <br>" + date;
        socket.send(data);
      }else{
        let data = "Comando incorrecto";
        socket.send(data);
      }
    }else{
      io.send(msg); //-- Todos
    }

  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);