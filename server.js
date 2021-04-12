//Declaraciones
const express = require("express");
const server = express();
const db = require("./js/db");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const utils = require("./js/utils")
const secret = "jfausifuasoifjaewwtgc";

//Middlewares
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

authorization = (req, res, next) => {
    try {
      const authToken = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(authToken, secret);
      req.authInfo = decodedToken;
      console.log(decodedToken);
      next();
    } catch (error) {
      res.status(401);
      res.send("Debe autenticarse para realizar esta acción");
    }
};
isAdmin = (req, res, next) => {
    try {
      const admin = req.authInfo;
      if (admin.perfil == 0) {
        res.status(403);
        res.json("No puede realizar esta acción");
      } else {
        res.status(200);
        next();
      }
    } catch (error) {
      console.log(error);
      res.end();
    }
};
server.get("/", (req,res)=>{
    res.status("200");
    res.json("Data warehouse")
})
server.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        const pass = utils.MD5(password);
        const identificarUsuario = await db.sequelize.query("SELECT id, nombre, email, perfil FROM `usuarios` WHERE email = :email AND password = :password",{
            type : db.sequelize.QueryTypes.SELECT,
            replacements:{
                email: email,
                password: pass
            }
        })
        if (identificarUsuario.length !== 0) {                  
            const token = jwt.sign(identificarUsuario[0], secret);
            console.log("Bienvenido ", identificarUsuario[0].nombre);
            res.status(200);
            res.json(token);
          } else {
            res.status(401);
            res.send("Usuario o contraseña incorrectos");
          }
        
    } catch (error) {
        console.log(error);
        res.end();
    }
});
server.post("/usuarios",authorization,isAdmin,async(req,res)=>{
    const {nombre, apellido, email, perfil, password} = req.body;
    if (!nombre || nombre == "") {
        res.status(400);
        res.json("Debe ingresar su nombre");
        return;
      }
      if (!apellido || apellido == "") {
        res.status(400);
        res.json("Debe ingresar su apellido");
        return;
      }
      if(!email){
          res.status(400);
          res.json("Debe ingresar su email correctamente");
          return;
      }
      if(!perfil || perfil == ""){          
        res.status(400);
        res.json("Debe indicar un perfil de usuario");
        return;
      }
      if (!password || password == "") {
        res.status(400);
        res.json("Debe ingresar una contraseña");
        return;
      } else if (password.length < 4) {
        res.status(400);
        res.json("La contraseña es muy corta");
        return;
      }
      try {
          const pass = utils.MD5(password);
          let response = await db.sequelize.query("INSERT INTO usuarios (nombre,apellido,email,perfil,password) VALUES (:nombre, :apellido, :email, :perfil, :password)",{
              replacements:{
                  nombre: nombre,
                  apellido: apellido,
                  email: email,
                  perfil: perfil,
                  password: pass
              }, type: db.sequelize.QueryTypes.INSERT
          })
          console.log("Usuario agregado con exito");
          res.status(201);
          res.json(response);
      } catch (error) {
        console.log(error);
        res.status(500);
        res.json("Ha ocurrido un error inesperado");
      }
})
server.listen(process.env.PORT || 3000, () => {
    console.log("Server on port 3000");
});