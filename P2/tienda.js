//Puedo crear 3 páginas y en función del producto clickclado me lleva a una página con el disco diciendo que ha sido añadido con exito
//en este punto es donde se añade la cookie

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
  let contadorC = 0;
  //-- Cookies
  const cookie = req.headers.cookie;
  let cookie_product = "";
  let cookie_user = "";
  
  
  if (myURL.pathname == "/"){
    filename = "index.html"
    content = (myURL.pathname).split(["."])[1]

    console.log(content + "INDEX");

    if (content == "jpg" || content == "JPG") {
      content_type = "image/" + "jpeg";
    }else if (content == "png" || content == "PNG") {
      content_type = "image/" + "png";
    }else if (content == "gif"){
      content_type = "image/" + "gif";
    }else{
      content_type = "text/" + content;
    }

  }else if (myURL.pathname == "/procesar") {  //LOGIN                  
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
    content_type = "text/html";
    if (cookie != undefined){
      if (cookie_user != undefined && cookie_product != undefined){
        //-- Tomar de las cookies 
          //-- Nombre
        cookie_user = cookie.split('-');
        cookie_user =cookie_user[1].split(';')[0];
        
          //-- Carrito
        cookie_product =cookie[1].split(';')[1];
        cookie_product = cookie.split('carritor=')[1];
        
        //-- Tomar de los valores introducidos 
        let direccion = myURL.searchParams.get('direccion');
        let tarjeta = myURL.searchParams.get('tarjeta');

        if (direccion == "" || tarjeta == "" || cookie_user == "" || cookie_product == ""){
          filename = "respuesta_carrito.html";                //-- FichRespuesta
          contadorC = 0;
        }else{
          filename = "respuesta_carrito.html";                //-- FichRespuesta
          //-- Adición
          var nuevo_ped = {};
          nuevo_ped = { "nickname": "", "direccion": "","tarjeta" : "", "producto" : ""};
          pedidos.push(nuevo_ped);
          pedidos[pedidos.length - 1]["nickname"] = cookie_user;
          pedidos[pedidos.length - 1]["direccion"] = direccion;
          pedidos[pedidos.length - 1]["tarjeta"] = tarjeta;
          pedidos[pedidos.length - 1]["producto"] = cookie_product;
          //-- Convertir la variable a cadena JSON
          let myJSON = JSON.stringify(tienda);  
          //-- Guardarla en el fichero destino
          fs.writeFileSync(fichero_JSON, myJSON); 
          //-- Compra satisfactoria
          contadorC =+ 1;
        }

      }else{
        filename = "respuesta_carrito.html";
        console.log(cookie_user + " " + cookie_product + " bbbbbbb");
      }
    }else{
        filename = "respuesta_carrito.html";
        console.log(cookie_user + " " + cookie_product + "ccccccc");
    }
    
  }else if (myURL.pathname == "/acceso") {    //REGISTRO -> No es necesario
    filename = "index.html";                             //-- FichRespuesta
    content_type = "text/html";
    //-- Datos recogidos del formulario
    let nombre = myURL.searchParams.get('nombre');
    let nombre_usuario = myURL.searchParams.get('nombre_usuario');
    let correo_electronico = myURL.searchParams.get('correo_electronico');

    if (nombre == "" || nombre_usuario == "" || correo_electronico == ""){
      console.log("NO POSIBLE REALIRRRRRRRRRRRRRZAR");
    }else{
      console.log("NO POSIBLE REALIRRRRRRRRRRRRRZAREEEE");
      //-- Adición
      var nuevo_us = {};
      nuevo_us = { "nickname": "", "tipo": "","nombre" : "", "email" : ""};
      usuarios.push(nuevo_us);
      usuarios[usuarios.length - 1]["nickname"] = nombre_usuario;
      usuarios[usuarios.length - 1]["tipo"] = "común";
      usuarios[usuarios.length - 1]["nombre"] = nombre;
      usuarios[usuarios.length - 1]["email"] = correo_electronico;
      //-- Convertir la variable a cadena JSON
      let myJSON = JSON.stringify(tienda);  
      //-- Guardarla en el fichero destino
      fs.writeFileSync(fichero_JSON, myJSON);
    }

       
    
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

    if (filename == "./p1.html" || filename == "./p1cookie.html"){
      product_Name = productos[0]["nombre"];
      product_Description = productos[0]["descripcion"];
      product_Price = productos[0]["precio"];
      product_Stock = productos[0]["stock"];
      
    }else if(filename == "./p2.html" || filename == "./p2cookie.html"){
      product_Name = productos[1]["nombre"];
      product_Description = productos[1]["descripcion"];
      product_Price = productos[1]["precio"];
      product_Stock = productos[1]["stock"];
    }else if(filename == "./p3.html" || filename == "./p3cookie.html"){
      product_Name = productos[2]["nombre"];
      product_Description = productos[2]["descripcion"];
      product_Price = productos[2]["precio"];
      product_Stock = productos[2]["stock"];
    }else if (filename == "./form-shop.html"){
      if (cookie == undefined){
        Usuario = "";
        product_Name = "";
        contadorA = 0;
      }else{
        //-- Tomar de las cookies 
          //-- Nombre
        cookie_user = cookie.split('-');
        cookie_user =cookie_user[1].split(';')[0];
          
            //-- Carrito
        cookie_product =cookie[1].split(';')[1];
        cookie_product = cookie.split('carritor=')[1];
        
        if (cookie_product == undefined){
          contadorA = 0;
          Usuario = "";
          product_Name = "";
        }else{
          contadorA = 1;
          Usuario = cookie_user;
          product_Name = cookie_product;
        }
      }
    }
    //Cliente.js
    if (filename == './productos') {
      content_type = "application/json";
      filename = fichero_JSON;       
    }
    if (myURL.pathname == '/cliente.js') {
      content_type = "application/javascript";
      filename = 'cliente.js';
    }

  }
  //--LECTURA ASINCRONA -->
  fs.readFile(filename, (err, data) => {
    console.log(filename + "2303");


    //Página principal

    if (filename == "index.html" || filename== "./index.html" ){
      //-- No sesión inicializada
      if (contadorA  == 0) {
        if (cookie == undefined){
          const fichero = fs.readFileSync('index.html', 'utf-8');
          data = fichero.replace("*USUARIO*", "BIENVENIDO");
        }else{
          cookie_user = cookie.split('-');
          cookie_user =cookie_user[1].split(';')[0];
          const fichero = fs.readFileSync('index.html', 'utf-8');
          data = fichero.replace("*USUARIO*", cookie_user);
        }
      }else if (contadorA != 0) {
        //-- Si sesión inicializada
        if (cookie == undefined) {
          const fichero = fs.readFileSync('index.html', 'utf-8');
          data = fichero.replace("*USUARIO*", Usuario);
          //-- Asignar la cookie de usuario Chuck
          res.setHeader('Set-Cookie', "user=nombre-" + Usuario);
        }
      }
    }
    
    //Páginas de los productos
    
    if (filename == "./p1.html"){
      //console.log("Hay p1.html");
      const fichero = fs.readFileSync('p1.html', 'utf-8');
      data = fichero.replace("*DESCRIPCION*", product_Name);
      data = data.replace("*GENERO*", product_Description);
      data = data.replace("*PRECIO*", product_Price);
      data = data.replace("*STOCK*", product_Stock);   
    }

    if (filename == "./p2.html"){
      //console.log("Hay p1.html");
      const fichero = fs.readFileSync('p2.html', 'utf-8');
      data = fichero.replace("*DESCRIPCION*", product_Name);
      data = data.replace("*GENERO*", product_Description);
      data = data.replace("*PRECIO*", product_Price);
      data = data.replace("*STOCK*", product_Stock);
    }

    if (filename == "./p3.html"){
      //console.log("Hay p1.html");
      const fichero = fs.readFileSync('p3.html', 'utf-8');
      data = fichero.replace("*DESCRIPCION*", product_Name);
      data = data.replace("*GENERO*", product_Description);
      data = data.replace("*PRECIO*", product_Price);
      data = data.replace("*STOCK*", product_Stock);
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

    if (filename == "./p1cookie.html") {
      //-- Si la cookie no esta vacía -> Se añade cookie del carrito
      if (cookie != null) {
        res.setHeader('Set-Cookie', "carritor=" + product_Name);
        const fichero = fs.readFileSync('p1cookie.html', 'utf-8');
        data = fichero.replace("*DESCRIPCION*", "Producto añadido a la cesta");
      }else{
        const fichero = fs.readFileSync('p1cookie.html', 'utf-8');
        data = fichero.replace("*DESCRIPCION*", "No puedes añadir el producto a la cesta sin estar registrado");
      }
    }

    if (filename == "./p2cookie.html") {
      //-- Si la cookie no esta vacía -> Se añade cookie del carrito
      if (cookie != null) {
        res.setHeader('Set-Cookie', "carritor=" + product_Name);
        const fichero = fs.readFileSync('p2cookie.html', 'utf-8');
        data = fichero.replace("*DESCRIPCION*", "Producto añadido a la cesta");
      }else{
        const fichero = fs.readFileSync('p2cookie.html', 'utf-8');
        data = fichero.replace("*DESCRIPCION*", "No puedes añadir el producto a la cesta sin estar registrado");
      }
    }

    if (filename == "./p3cookie.html") {
      //-- Si la cookie no esta vacía -> Se añade cookie del carrito
      if (cookie != null) {
        res.setHeader('Set-Cookie', "carritor=" + product_Name);
        const fichero = fs.readFileSync('p3cookie.html', 'utf-8');
        data = fichero.replace("*DESCRIPCION*", "Producto añadido a la cesta");
      }else{
        const fichero = fs.readFileSync('p3cookie.html', 'utf-8');
        data = fichero.replace("*DESCRIPCION*", "No puedes añadir el producto a la cesta sin estar registrado");
      }
    }
    //-- Proceso de compra
    if (filename == "./form-shop.html"){
      if (contadorA == 1){
        const fichero = fs.readFileSync('form-shop.html', 'utf-8');
        data = fichero.replace("*USUARIO*", Usuario);
        data = data.replace("*PRODUCTOS*", product_Name);
      }else{
        const fichero = fs.readFileSync('form-shop.html', 'utf-8');
        data = fichero.replace("*USUARIO*", Usuario);
        data = data.replace("*PRODUCTOS*", product_Name);
      }
    }
    //-- Respuesta al realizar la compra
    if (filename == "respuesta_carrito.html" && contadorC == 1){
      console.log("SAT");
      //Satisfactorio
      const fichero = fs.readFileSync('respuesta_carrito.html', 'utf-8');
      data = fichero.replace("*DESCRIPCION*", "Compra finalizada");
    }else if (filename == "respuesta_carrito.html" && contadorC == 0){
      //No satisfactorio
      console.log("NOSAT");
      const fichero = fs.readFileSync('respuesta_carrito.html', 'utf-8');
      data = fichero.replace("*DESCRIPCION*", "No se ha podido realizar la compra. Revise los parametros introducidos");
    }

    //Errores

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