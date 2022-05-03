//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");

const btn_test = document.getElementById("btn_test");

const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");


//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info1.textContent = process.versions.node;
info2.textContent = process.versions.chrome;
info3.textContent = process.versions.electron;

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

//--Acciones en función del mensaje recibido
socket.on("message", (msg)=>{
    display.innerHTML = '<p style="color:black">' + msg + '</p>' + display.innerHTML;
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);
  
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}

btn_test.onclick = () => {
  console.log("Botón apretado!");

  //-- Enviar mensaje al proceso principal
  electron.ipcRenderer.invoke('test', "MENSAJE DE PRUEBA: Que tengas un bonito día :D");
}