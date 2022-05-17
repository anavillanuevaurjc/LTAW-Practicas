//Obtención 
const electron = require('electron');
const qrcode = require('qrcode');
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info4 = document.getElementById("info4");
const info5 = document.getElementById("info5");
const info6 = document.getElementById("info6");
const users = document.getElementById("users");
const ip = document.getElementById("ip");
const code = document.getElementById("qrcode");
const boton = document.getElementById("btn_test");
const display = document.getElementById("display");


//-- Información
electron.ipcRenderer.on('informacion', (event, message) => {

    console.log("Recibido: " + message);

    //DATOS
    info1.textContent = message[0];

    info2.textContent = message[1];

    info3.textContent = message[2];

    info4.textContent = message[3];

    info5.textContent = message[4];

    info6.textContent = message[5];

    url = ("http://" + message[6] + ":" + message[7] + "/");
    
    ip.textContent = url;

    //-- Generar el codigo qr de la url
    qrcode.toDataURL(url, function (err, url) {
        code.src = url;
    });
});

//-- Numero de usuarios
electron.ipcRenderer.on('users', (event, message) => {
    console.log("Recibido: " + message);
    users.textContent = message;
});

//-- Mensajes de los clientes
electron.ipcRenderer.on('msg_client', (event, message) => {
    console.log("Recibido: " + message);
    display.innerHTML += message + "<br>";
});

//Mensajes enviados al proceso MAIN ------
boton.onclick = () => {
    console.log("Botón apretado!");
    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "Hola, chato!");
};
