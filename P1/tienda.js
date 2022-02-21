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
  if (myURL.pathname == "/"){
    filename = "index.html"
    content = (myURL.pathname).split(["."])[1]
    content_type = "text/" + content;
  }else{
    content = (myURL.pathname).split(["."])[1]
    content_type = "text/" + content;
    filename = "." + myURL.pathname;
  }
  
  console.log("URL busqueda correcta" + filename);
  console.log("Tipo de contenido " + content);

  //--LECTURA ASINCRONA -->
  fs.readFile(filename, (err, data) => {
    if (err) {
        console.log('Error')
        let code = 404;
        let code_msg = "Not Found";
        data = fs.readFileSync('error.html','utf8');
        content = (myURL.pathname).split(["."])[1]
        content_type = "text/" + content;
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