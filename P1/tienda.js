//-- Modulos -->
const http = require('http');
const fs = require('fs');
const url = require('url');

//-- Puerto -->
const PUERTO = 9090;

//-- Texto HTML de la página de error -->
const pagina_error = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi tienda</title>
</head>
<body style="background-color: red">
    <h1 style="color: white">ERROR!!!!</h1>
</body>
</html>
`

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
        const data = fs.readFileSync('error.html','utf8');
        //res.statusCode = 404;
        //res.statusMessage = "Ha habido un error";
        //res.setHeader('Content-Type', "text/html");
        res.write(data);
        return res.end();
    }

    console.log(content_type)
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








