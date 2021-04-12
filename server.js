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

server.get("/", (req,res)=>{
    res.status("200");
    res.json("Data warehouse")
})
server.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        const pass = utils.MD5(password);
        const identificarUsuario = await db.sequelize.query("SELECT id, nombre, email, perfil FROM `contactos` WHERE email = :email AND password = :password",{
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
})
server.listen(process.env.PORT || 3000, () => {
    console.log("Server on port 3000");
});