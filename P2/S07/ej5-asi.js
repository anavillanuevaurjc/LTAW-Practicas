//-- Servidor JSON

const http = require('http');
const fs = require('fs');
const PUERTO = 9090;

//-- Cargar pagina web principal
const MAIN = fs.readFileSync('Ej-01.html','utf-8');

//-- Leer fichero JSON con los productos
const PRODUCTOS_JSON = fs.readFileSync('Ej-01.json');

let tienda = JSON.parse(PRODUCTOS_JSON);

const pArray = [];
const productos = tienda[0].productos;

productos.forEach((element, index)=>{
  pArray.push(productos[index]["nombre"]);
});
//-- Convertir la variable a cadena JSON
let myJSON = JSON.stringify(pArray);  

//-- Guardarla en el fichero destino
fs.writeFileSync('ficheroJSON2.json', myJSON); 

let result = [];
let param1 = "";
console.log(pArray);

//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {

    //-- Construir el objeto url con la url de la solicitud
    const myURL = new URL(req.url, 'http://' + req.headers['host']);  

    //-- Por defecto entregar página web principal
    if (myURL.pathname == "/"){
        filename = "Ej-05.html";
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
        filename = 'ficheroJSON2.json';
        //filename = pArray;
        
    }

    if (myURL.pathname == '/cliente-4.js') {
      content_type = "application/javascript";
      filename = 'cliente-4.js';
  }
  
    fs.readFile(filename, (err, data) => {
      console.log(filename + "HABER");
      if (filename == '/productos'){
        let param1 = myURL.searchParams.get('param1');

        param1 = param1.toUpperCase();

        console.log("  Param: " +  param1);

        let result = [];

        for (let prod of pArray) {
          console.log(pArray + "AAAAAAAA");
          //-- Pasar a mayúsculas
          prodU = prod.toUpperCase();

          //-- Si el producto comienza por lo indicado en el parametro
          //-- meter este producto en el array de resultados
          if (prodU.startsWith(param1)) {
              result.push(prod);
          }
          
      }
      console.log(result + "REEEEEE");
      content = JSON.stringify(result);
      }
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