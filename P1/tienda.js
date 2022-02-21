//-- Modulos -->
const http = require('http');
const fs = require('fs');
const url = require('url');

//-- Puerto -->
const PUERTO = 9090;

//-- Servidor -->
console.log("Escuchando...");

const server = http.createServer((req, res) => {
  console.log("Petición recibida!");
  const myURL = new URL(req.url, 'http://' + req.headers['host']);
  console.log("URL solicitada: " + myURL.pathname);
  content = (myURL.pathname).split(["."])[1]
  content_type = "text/" + content;
  filename = "." + myURL.pathname;
  console.log("URL busqueda correcta" + filename);
  console.log("Tipo de contenido " + content);

  //--LECTURA ASINCRONA -->
  fs.readFile(filename, (err, data) => {
    if (err) {
        console.log('Error')
        data = fs.readFileSync('error.html','utf8');
        content = (myURL.pathname).split(["."])[1]
        content_type = "text/" + content;
        res.statusCode = 404;
        res.statusMessage = "Not Found";
        res.setHeader('Content-Type', content_type);
        res.write(data);
        return res.end();
    }

    console.log(content_type)
    let code = 200;
    let code_msg = "OK";
    res.statusCode = code;
    res.statusMessage = code_msg;
    res.write(data);  //Su ausencia da lugar a error 
    res.end();      //Su ausencia da lugar a error 
  });  
});

server.listen(PUERTO);

//Fichero html      -> .html
//Fichero imagen    -> .jpg .png
//Fichero css       -> .css
//Devolver el fichero pedido, si no se localiza -> pagina de error

//Crear servidor 
//Llamar a funcion retrollamada en cada peticion 

  //Cuando llegue peticion se ha de localizar el recurso pedido 
  //(sacarlo por la consola)
  //Obtener el nombre del fichero --> /index.html --> index.html (valido) -> BUSCAR

  //Lectura asincrona del fichero 
    //Funcion de retrollamada cuando fin de lectura o error 

    //Comprobacion de lectura correcta -> Imprimir en consola nombre fichero leido

    //En caso de error generar página HTML de error -> generada en constante
    //Si no hay error 
      //Devolver contenido del fichero como respuesta 
      //La respuesta depende del tipo de fichero 
        //HTML: en la cabecera 'Content-Type' -> 'text/html'
        //Imagen: en la cabecera 'Content-Type' -> 'image/jpg' 'image/png'
        //CSS: 'text/css'

        //¿? Determinar que tipo de fichero 
        //Por la extension del fichero: -> Nombre.html -> fichero HTML
        //A partir del nombre del fichero obtener su extension -> BUSCAR








