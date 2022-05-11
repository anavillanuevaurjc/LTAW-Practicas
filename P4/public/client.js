//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

//-- Evento message
socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:black">' + msg + '</p>';
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  //-- Si hay valor en la caja, enviar
  if (msg_entry.value){
    socket.send('Mensaje: ' + msg_entry.value);
  }
  //-- Borrar el mensaje 
  msg_entry.value = "";
}
