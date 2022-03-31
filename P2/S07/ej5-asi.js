//-- Servidor JSON

const http = require('http');
const fs = require('fs');
const PUERTO = 9090;

//-- Cargar pagina web principal
const MAIN = fs.readFileSync('Ej-01.html','utf-8');

//-- Leer fichero JSON con los productos
const PRODUCTOS_JSON = fs.readFileSync('Ej-01.json');

//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {

    //-- Construir el objeto url con la url de la solicitud
    const myURL = new URL(req.url, 'http://' + req.headers['host']);  
  
    console.log(myURL.pathname);
    //-- Por defecto entregar página web principal
    if (myURL.pathname == "/"){
        filename = "Ej-02.html";
        content = (myURL.pathname).split(["."])[1]
        if (content == "jpg" || content == "JPG") {
          content_type = "image/" + "jpeg";
        }else if (content == "png" || content == "PNG") {
          content_type = "image/" + "png";
        }else if (content == "gif"){
          content_type = "image/" + "gif";
        }else{
          content_type = "text/" + content;
        }
    }

  
    if (myURL.pathname == '/productos') {
        content_type = "application/json";
        filename = 'Ej-01.json';
    }

    if (myURL.pathname == '/cliente-1.js') {
      content_type = "application/javascript";
      filename = 'cliente-1.js';
  }
  
    fs.readFile(filename, (err, data) => {
        if (err) {
            console.log('Error')
            let code = 404;
            let code_msg = "Not Found";
            data = fs.readFileSync('error_page.html','utf8');
            content = (myURL.pathname).split(["."])[1]
            if (content == "jpg" || content == "JPG") {
              content_type = "image/" + "jpeg";
            }else if (content == "png" || content == "PNG") {
              content_type = "image/" + "png";
            }else if (content == "gif"){
              content_type = "image/" + "gif";
            }else{
              content_type = "text/" + content;
            }
            res.statusCode = code;
            res.statusMessage = code_msg;
            //res.statusCode = 404;
            //res.statusMessage = "Not Found";
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
  console.log("Escuchando en puerto: " + PUERTO);