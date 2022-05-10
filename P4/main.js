//-- Cargar el módulo de electron
const electron = require('electron');
//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const fs = require('fs');

console.log("Arrancando electron...");

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;
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
  path = __dirname + 'public/index.html';
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
    //-- Nuevo usuario conectado

  }
  console.log('** NUEVA CONEXIÓN **'.yellow);
  counter = counter + 1;

  //-- Enviar un mensaje al proceso de renderizado para que lo saque
  //-- por la interfaz gráfica de numero de usuarios
  win.webContents.send('sendUsers', counter);

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



//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {
    console.log("Evento Ready!");

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 600,   //-- Anchura 
        height: 600,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
    });

  //-- En la parte superior se nos ha creado el menu
  //-- por defecto
  //-- Si lo queremos quitar, hay que añadir esta línea
  //win.setMenuBarVisibility(false)

  //-- Cargar contenido web en la ventana
  //-- La ventana es en realidad.... ¡un navegador!
  //win.loadURL('https://www.urjc.es/etsit');

  //-- Cargar interfaz gráfica en HTML
  win.loadFile("index.html");

  //-- Esperar a que la página se cargue y se muestre
  //-- y luego enviar el mensaje al proceso de renderizado para que 
  //-- lo saque por la interfaz gráfica
  win.on('ready-to-show', () => {
    win.webContents.send('print', "MENSAJE ENVIADO DESDE PROCESO MAIN");
  });

  //-- Enviar un mensaje al proceso de renderizado para que lo saque
  //-- por la interfaz gráfica
  win.webContents.send('print', "MENSAJE ENVIADO DESDE PROCESO MAIN");

});


//-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
//-- renderizado. Al recibirlos se escribe una cadena en la consola
electron.ipcMain.handle('test', (event, msg) => {
  console.log("-> Mensaje: " + msg);
});