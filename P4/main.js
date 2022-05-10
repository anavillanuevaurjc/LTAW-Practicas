//-- Cargar las dependencias
const socket = require('socket.io');

const http = require('http');

const express = require('express');

const colors = require('colors');

const electron = require('electron');

const ip = require('ip');

const process = require('process');

const PUERTO = 9090;

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;

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
    console.log('** NUEVA CONEXIÓN **'.yellow);
    counter = counter + 1;
    //-- Enviar numero de usuarios al renderer
    win.webContents.send('users', counter);
    io.send("Un nuevo usuario se ha unido al chat");
    socket.send("BIENVENIDO");
    //-- Enviar al render mensaje de conexion
    win.webContents.send('msg_client', "Un nuevo usuario se ha unido al chat");
    new_user = false;
  }

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    counter = counter - 1;
    //-- Enviar numero de usuarios al renderer
    win.webContents.send('users', counter);
    //-- Enviar mensaje de desconexión de usuario a todos los usuarios
    io.send("Un usuario ha abandonado el chat");
    //-- Enviar al render mensaje de desconexion
    win.webContents.send('msg_client', "Un usuario ha abandonado el chat");
    
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);
    let split_msg = Array.from(msg);
    if (split_msg[0] == "/"){
      let data;
      console.log("socket.send");
      if (msg == "/list"){
        data = "Número de participantes: " + counter;
        socket.send(data);
      }else if (msg == "/hello"){
        data = "Hello";
        socket.send(data);
      }else if (msg == "/help") {
        data = "Comandos: <br><br>/help -> Provoca la muestra la lista de comandos existentes <br><br>/hello -> Provoca un saludo por parte del servidor <br><br>/list -> Provoca la visualización de la cantidad de participantes <br><br>/date -> Provoca la visualización de la fecha";
        socket.send(data);
      }else if (msg == "/date") { 
        let date = new Date(Date.now());
        let data = "Fecha: <br>" + date;
        socket.send(data);
      }else{
        data = "Comando incorrecto";
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

// Crear la app de electron 
electron.app.on('ready', () => {
    console.log("Evento Ready!");

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 1000,  //-- Anchura 
        height: 1000,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
      }

    });

    //-- Cargar interfaz gráfica en HTML
    let fichero = "index.html"
    win.loadFile(fichero);

    //-- Obtener informacion a enviar al renderizador
    //-- Obtener versiones
    v_node = process.versions.node;
    v_chrome = process.versions.chrome;
    v_electron = process.versions.electron;
    //-- Obtener arquitectura
    arch = process.arch;
    //-- Obtener plataforma
    platform = process.platform;
    //-- obtener directorio
    direct = process.cwd();
    //-- Obtener direccion IP
    dir_ip = ip.address();
    //-- Numero de usuario ya lo tenemos calculado
    //-- El puerto tambien

    //-- Reagrupar los datos a enviar
    let datos = [v_node, v_chrome, v_electron, arch, platform, direct,
                dir_ip, PUERTO, fichero];

    //-- Esperar a que la página se cargue  con el evento 'ready-to-show'
    win.on('ready-to-show', () => {
        console.log("Enviando datos...");
        //-- send(nombre evento, mensaje)
        win.webContents.send('informacion', datos);
    });

});

//----- Mensajes recibidos del renderizado --------

//-- Esperar a recibir los mensajes de botón apretado (Test)
electron.ipcMain.handle('test', (event, msg) => {
    console.log("-> Mensaje: " + msg);
    //-- Reenviarlo a todos los clientes conectados
    io.send(msg);
});