//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const msg_nick = document.getElementById("msg_nick");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

//--Acciones en función del mensaje recibido
socket.on("message", (msg)=>{
    display.innerHTML = '<p style="color:black">' + msg + '</p>' + display.innerHTML;
});
//-- Al apretar el botón se envía un mensaje al servidor
msg_nick.onchange = () => {
  if (msg_nick.value)
  socket.send("Nick = " + msg_nick.value);
}


//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);
  
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}