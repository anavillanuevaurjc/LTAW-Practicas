//-- Modulos -->
const http = require('http');
const fs = require('fs');
const url = require('url');
const { count } = require('console');

//-- Puerto -->
const PUERTO = 9090;

//-- JSON --> 

//-- Nombre del fichero JSON a leer
const fichero_JSON = "tienda.json";
//-- Leer el fichero JSON
const tienda_JSON = fs.readFileSync(fichero_JSON);
//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_JSON);
const productos = tienda[0].productos;
const usuarios = tienda[1].usuarios;
const nu_usuarios = usuarios.length;
const pedidos = tienda[2].pedidos;
//console.log("Productos tienda: " +  productos.length);
//console.log("Usuarios tienda: " +  usuarios.length);
//console.log("Pedidos tienda: " + pedidos.length);


//-- Servidor -->
console.log("Escuchando...");

const server = http.createServer((req, res) => {
  const myURL = new URL(req.url, 'http://' + req.headers['host']);
  let Usuario = "";
  //--Descripciones de los productos
  let product_Name = "";
  let product_Description = "";
  let product_Price = "";
  let product_Stock = "";
  //--Contador login
  let contadorA = 0;
  //-- Cookies
  const cookie = req.headers.cookie;
  let cookie_product = "";
  let cookie_user = "";
  
  if (myURL.pathname == "/"){
    filename = "index.html"
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
    //Funciona correctamente
    //console.log(productos[0]["nombre"]);
    //productos[0]["nombre"] = "AMAIA"
    //console.log(productos[0]["nombre"]);
    //-- Convertir la variable a cadena JSON
    //let myJSON = JSON.stringify(tienda);  
    //-- Guardarla en el fichero destino
    //fs.writeFileSync(fichero_JSON, myJSON);   

  }else if (myURL.pathname == "/procesar") {  //LOGIN                  //-- FichRespuesta
    
    content_type = "text/html";
    Usuario = myURL.searchParams.get('accesoUsuario');
    contadorA = 0;
    //-- Recorrer el array de productos
    usuarios.forEach((element, index)=>{
      if (Usuario == element["nickname"]) {
        contadorA =+ 1;
      } 
    });
    //-- Si el contador es distinto de 0 -> usuario dado coincide con usuarios registrados
    if (contadorA != 0) {
      filename = "index.html";
    }else{
      filename = "form-user.html";
    }
    
    
  }else if (myURL.pathname == "/carrito") {   //CARRITO
    filename = "respuesta_carrito.html";                //-- FichRespuesta
    content_type = "text/html";
    //-- Tomar de las cookies 
      //-- Nombre
      cookie_user = cookie.split('-');
      cookie_user =cookie_user[1].split(';')[0];
      console.log("COOKIEUSER " +  cookie_user);
      //-- Carrito
      cookie_product =cookie[1].split(';')[1];
      cookie_product = cookie.split('carritor=')[1];
      console.log("COOKIEPRODUCT " + cookie_product);
    
  }else if (myURL.pathname == "/acceso") {    //REGISTRO -> No es necesario
    filename = "index.html";                             //-- FichRespuesta
    content_type = "text/html";
    //-- Datos recogidos del formulario
    let nombre = myURL.searchParams.get('nombre');
    let nombre_usuario = myURL.searchParams.get('nombre_usuario');
    let correo_electronico = myURL.searchParams.get('correo_electronico');

    //-- Modificacion JSON -> No es encesario
    //-- En la posicion [0] esta el 1er cliente
    //-- En la posicion [1] esta el 2º cliente 
    //-- ¿Como puedo introducir las variables del nuevo cliente?
    //-- Convertir la variable a cadena JSON
    //let myJSON = JSON.stringify(tienda);  
    //-- Guardarla en el fichero destino
    //fs.writeFileSync(fichero_JSON, myJSON);   
    
  }else{
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
    filename = "." + myURL.pathname;

    //-- Obtención de los elementos de la base de datos

    if (filename == "./p1.html"){
      product_Name = productos[0]["nombre"];
      product_Description = productos[0]["descripcion"];
      product_Price = productos[0]["precio"];
      product_Stock = productos[0]["stock"];
      
    }else if(filename == "./p2.html"){
      product_Name = productos[1]["nombre"];
      product_Description = productos[1]["descripcion"];
      product_Price = productos[1]["precio"];
      product_Stock = productos[1]["stock"];
    }else if(filename == "./p3.html"){
      product_Name = productos[2]["nombre"];
      product_Description = productos[2]["descripcion"];
      product_Price = productos[2]["precio"];
      product_Stock = productos[2]["stock"];
    }else{
      product_Description = "";
    }

  }
  //--LECTURA ASINCRONA -->
  fs.readFile(filename, (err, data) => {
    console.log(cookie);
    //Página principal
 
    if (filename == "index.html" && contadorA == 0 || filename== "./index.html" && contadorA == 0 ){
      //-- No sesión inicializada
      const fichero = fs.readFileSync('index.html', 'utf-8');
      data = fichero.replace("*USUARIO*", "BIENVENIDO");
    }else if (filename == "index.html" && contadorA == 1){
      //-- Si sesión inicializada
      const fichero = fs.readFileSync('index.html', 'utf-8');
      data = fichero.replace("*USUARIO*", Usuario);
      //-- Asignar la cookie de usuario Chuck
      res.setHeader('Set-Cookie', "user=nombre-" + Usuario);
    }
    
    //Páginas de los productos
    
    if (filename == "./p1.html"){
      //console.log("Hay p1.html");
      const fichero = fs.readFileSync('p1.html', 'utf-8');
      data = fichero.replace("*DESCRIPCION*", product_Name);
      data = data.replace("*GENERO*", product_Description);
      data = data.replace("*PRECIO*", product_Price);
      data = data.replace("*STOCK*", product_Stock);
      
      //-- Si la cookie no esta vacía -> Se añade cookie del carrito
      if (cookie != null) {
        res.setHeader('Set-Cookie', "carritor=" + product_Name);
      }
      
      
    }

    if (filename == "./p2.html"){
      //console.log("Hay p1.html");
      const fichero = fs.readFileSync('p2.html', 'utf-8');
      data = fichero.replace("*DESCRIPCION*", product_Name);
      data = data.replace("*GENERO*", product_Description);
      data = data.replace("*PRECIO*", product_Price);
      data = data.replace("*STOCK*", product_Stock);
      //-- Si la cookie no esta vacía -> Se añade cookie del carrito
      if (cookie != null) {
        res.setHeader('Set-Cookie', "carritor=" + product_Name);
      }
    }

    if (filename == "./p3.html"){
      //console.log("Hay p1.html");
      const fichero = fs.readFileSync('p3.html', 'utf-8');
      data = fichero.replace("*DESCRIPCION*", product_Name);
      data = data.replace("*GENERO*", product_Description);
      data = data.replace("*PRECIO*", product_Price);
      data = data.replace("*STOCK*", product_Stock);
      //-- Si la cookie no esta vacía -> Se añade cookie del carrito
      if (cookie != null) {
        res.setHeader('Set-Cookie', "carritor=" + product_Name);
      }
    }

    //-- Login 
    
    if (filename == "./login-user.html" && cookie != null){
      cookie_user = cookie.split('-');
      cookie_user =cookie_user[1].split(';')[0];
      const fichero = fs.readFileSync('respuesta_login.html', 'utf-8');
      data = fichero.replace("*NOMBRE*", cookie_user);
    }else if (filename == "./login-user.html" && cookie == null){
      data = fs.readFileSync('login-user.html', 'utf-8');
    }
    
    //-- Añadir cookie producto escogido -- Se ha de realizar unicammente si esta la cookie del usuario

 
    if (filename == "./add_product.html" && cookie != null) {
      cookie_product =cookie[1].split(';')[1];
      cookie_product = cookie.split('carritor=')[1];
      const fichero = fs.readFileSync('add_product.html', 'utf-8');
      data = fichero.replace("*DESCRIPCION*", "Producto añadido al carrito con exito");
    }else if (filename == "./add_product.html" && cookie == null){
      cookie_product = null;
      const fichero = fs.readFileSync('add_product.html', 'utf-8');
      data = fichero.replace("*DESCRIPCION*", "No estas registrado, por tanto, no puedes añadir productos al carrito");
    }


    if (err) {
        console.log('Error')
        let code = 404;
        let code_msg = "Not Found";
        data = fs.readFileSync('error.html','utf8');
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
        res.setHeader('Content-Type', content_type);
        res.write(data);
        return res.end();
    }
    
    console.log(content_type)
    let code = 200;
    let code_msg = "OK";
    res.statusCode = code;
    res.statusMessage = code_msg;
    res.write(data);  
    res.end();      
  });  
});

server.listen(PUERTO);