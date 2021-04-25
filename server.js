//Declaraciones
const express = require("express");
const server = express();
const db = require("./js/db");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const utils = require("./js/utils");
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
server.get("/infociudades",async(req,res)=>{
  try {
    let consulta = await db.sequelize.query(
      `SELECT ciudades.id AS id_ciudad,paises.id AS id_pais ,regiones.id AS id_region, ciudades.nombre AS ciudad,
      paises.nombre AS pais,
      regiones.nombre AS region 
      FROM ciudades 
      RIGHT JOIN paises
      ON ciudades.pais = paises.id
      RIGHT JOIN regiones
      ON paises.region = regiones.id`
    ,{
      type: db.sequelize.QueryTypes.SELECT,
    });    
    res.status(200)
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.get("/regiones", authorization, async(req,res)=>{
  try {
    let consulta = await db.sequelize.query(
      `SELECT * FROM regiones`
    ,{
      type: db.sequelize.QueryTypes.SELECT,
    });    
    res.status(200)
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
})
server.post("/regiones",authorization,isAdmin,async(req,res)=>{
  try {
    const nombre = req.body.nombre;
    if(nombre=="" || nombre ==null){
      res.status(400);
      res.json("Debe ingresar el nombre");
      return;
    } else if(await utils.isAlreadyInDB(nombre, "regiones")){
      res.status(400);
      res.json("Región ya ingresada en base de datos")
      return
    }    
    let consulta = await db.sequelize.query(`
      INSERT into regiones (nombre) VALUES (:nombre)
    `,{
      replacements:{        
        nombre: nombre
      }, type: db.sequelize.QueryTypes.INSERT
    })
    res.status(201);    
    console.log("Región agregada con exito");
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
server.patch("/regiones/:id",authorization, isAdmin, async(req,res)=>{
  try {
    const id = req.params.id;
    const nombre = req.body.nombre;
    if(nombre== "" || nombre ==null){
      res.status(400);
      res.json("Debe ingresar el nombre");
      return;
    }
    let consulta = await db.sequelize.query("UPDATE regiones SET nombre = :nombre WHERE id = :id",{
      replacements:{
        id: id,
        nombre: nombre
      }, type: db.sequelize.QueryTypes.UPDATE
    });
    if(consulta.length === 0){
      res.status(404);
      res.json("Región no encontrada");
      return
    }
    res.status(200);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
server.delete("/regiones/:id",authorization,isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    let consulta = await db.sequelize.query("DELETE FROM regiones WHERE id = :id",{
      replacements: {
        id: id,
      },type: db.sequelize.QueryTypes.DELETE
    });    
    res.status(200)
    console.log("Región eliminada");
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
})
server.get("/paises", async(req,res)=>{
  try {
    let consulta = await db.sequelize.query(
      `SELECT * FROM paises`
    ,{
      type: db.sequelize.QueryTypes.SELECT,
    });    
    res.status(200)
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
})
server.post("/paises",authorization,isAdmin,async(req,res)=>{
  try {
    const {nombre,region} = req.body;
    if(nombre=="" || nombre ==null){
      res.status(400);
      res.json("Debe ingresar el nombre");
      return;
    } else if(await utils.isAlreadyInDB(nombre, "paises")){
      res.status(400);
      res.json("Pais ya ingresado en base de datos")
      return
    }
    if(isNaN(region)){
      res.status(400);
      res.json("Debe ingresar el id de la región");
      return;
    }
    let consulta = await db.sequelize.query(`
      INSERT into paises (region, nombre) VALUES (:region, :nombre)
    `,{
      replacements:{
        region: region,
        nombre: nombre
      }, type: db.sequelize.QueryTypes.INSERT
    })
    res.status(201);    
    console.log("Pais agregado con exito");
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
server.get("/ciudades", async(req,res)=>{
  try {
    let consulta = await db.sequelize.query(
      `SELECT * FROM ciudades`
    ,{
      type: db.sequelize.QueryTypes.SELECT,
    });    
    res.status(200)
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
})
server.post("/ciudades",authorization,isAdmin,async(req,res)=>{
  try {
    const {nombre,pais} = req.body;
    if(nombre=="" || nombre ==null){
      res.status(400);
      res.json("Debe ingresar el nombre");
      return;
    } else if(await utils.isAlreadyInDB(nombre, "ciudades")){
      res.status(400);
      res.json("Ciudad ya ingresada en base de datos")
      return
    }
    if(isNaN(pais)){
      res.status(400);
      res.json("Debe ingresar el id de la región");
      return;
    }
    let consulta = await db.sequelize.query(`
      INSERT into ciudades (pais, nombre) VALUES (:pais, :nombre)
    `,{
      replacements:{
        pais: pais,
        nombre: nombre
      }, type: db.sequelize.QueryTypes.INSERT
    })
    res.status(201);    
    console.log("Ciudad agregada con exito");
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
server.patch("/ciudades/:id",authorization,isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    const nombre = req.body.nombre;
    if(nombre== "" || nombre ==null){
      res.status(400);
      res.json("Debe ingresar el nombre");
      return;
    }
    let consulta = await db.sequelize.query("UPDATE ciudades SET nombre = :nombre WHERE id = :id",{
      replacements:{
        id: id,
        nombre: nombre
      }, type: db.sequelize.QueryTypes.UPDATE
    });
    if(consulta.length === 0){
      res.status(404);
      res.json("Ciudad no encontrada");
      return
    }
    res.status(200);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500);
  }
})
server.patch("/paises/:id",authorization,isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    const nombre = req.body.nombre;
    if(nombre== "" || nombre ==null){
      res.status(400);
      res.json("Debe ingresar el nombre");
      return;
    } 
    let consulta = await db.sequelize.query("UPDATE paises SET nombre = :nombre WHERE id = :id",{
      replacements:{
        id: id,
        nombre: nombre
      }, type: db.sequelize.QueryTypes.UPDATE
    });
    if(consulta.length === 0){
      res.status(404);
      res.json("Pais no encontrado");
      return
    }
    res.status(200);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
server.delete("/paises/:id",authorization,isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    let consulta = await db.sequelize.query("DELETE FROM paises WHERE id = :id",{
      replacements: {
        id: id,
      },type: db.sequelize.QueryTypes.DELETE
    });    
    res.status(200)
    console.log("Pais eliminado");
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
})
server.delete("/ciudades/:id",authorization,isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    let consulta = await db.sequelize.query("DELETE FROM ciudades WHERE id = :id",{
      replacements: {
        id: id,
      },type: db.sequelize.QueryTypes.DELETE
    });    
    res.status(200)
    console.log("Ciudad eliminada");
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.get("/companias", authorization, async(req,res)=>{
  try {
    let consulta = await db.sequelize.query(`
    SELECT companias.id AS id_compania,
    regiones.id AS id_region,
    paises.id AS id_pais,
    ciudades.id AS id_ciudad,
    companias.nombre AS compania,
    companias.direccion,
    companias.email,
    companias.telefono,    
    ciudades.nombre AS ciudad,    
    paises.nombre AS pais
    FROM companias
    JOIN ciudades
    ON companias.ciudad = ciudades.id
    JOIN paises ON ciudades.pais = paises.id
    JOIN regiones ON paises.region = regiones.id`,{
      type: db.sequelize.QueryTypes.SELECT,
    });    
    res.status(200);
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.post("/companias",authorization,isAdmin,async(req,res)=>{
  try {    
    const {nombre, email, direccion, telefono, ciudad} = req.body;
    if(!nombre || !email || !direccion || !telefono || !ciudad){
      res.status(400);
      res.json("Falta algún parámetro");
      return;
    } 
    let consulta = await db.sequelize.query("INSERT INTO companias (nombre, direccion, email, telefono, ciudad) VALUES (:nombre, :direccion, :email, :telefono, :ciudad)",{
      replacements:{        
        nombre: nombre,
        direccion: direccion,
        email: email,
        telefono: telefono,
        ciudad: ciudad
      }, type: db.sequelize.QueryTypes.INSERT
    });    
    console.log("Compañia agregada con exito");
    res.status(201);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500);
  }
})
server.patch("/companias/:id",authorization,isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    const {nombre, email, direccion, telefono, ciudad} = req.body;
    if(!nombre || !email || !direccion || !telefono || !ciudad){
      res.status(400);
      res.json("Falta algún parámetro");
      return;
    } 
    let consulta = await db.sequelize.query("UPDATE companias SET nombre = :nombre, direccion = :direccion, email = :email, telefono = :telefono, ciudad = :ciudad WHERE id = :id",{
      replacements:{
        id: id,
        nombre: nombre,
        direccion: direccion,
        email: email,
        telefono: telefono,
        ciudad: ciudad
      }, type: db.sequelize.QueryTypes.UPDATE
    });
    if(consulta.length === 0){
      res.status(404);
      res.json("Compañia no encontrada");
      return
    }
    res.status(200);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
server.delete("/companias/:id",authorization,isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    let consulta = await db.sequelize.query("DELETE FROM companias WHERE id = :id",{
      replacements: {
        id: id,
      },type: db.sequelize.QueryTypes.DELETE
    });    
    res.status(200);
    console.log("Compania eliminada");
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.get("/contactos/",authorization, async(req,res)=>{
  try {
    let consulta = await db.sequelize.query("SELECT contactos.id, contactos.nombre AS nombre,contactos.apellido AS apellido, cargo, contactos.email AS email, companias.id AS id_compania, companias.nombre AS compania, paises.nombre AS pais, regiones.nombre AS region, interes.porcentaje, contactos.direccion AS direccion FROM contactos JOIN ciudades ON ciudades.id = contactos.ciudad JOIN paises ON paises.id = ciudades.pais JOIN companias ON contactos.compania = companias.id JOIN regiones ON regiones.id = paises.region JOIN interes ON contactos.interes = interes.id ORDER BY contactos.id",{
      type: db.sequelize.QueryTypes.SELECT,
    });
    res.status(200);
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
})

server.listen(process.env.PORT || 3000, () => {
    console.log("Server on port 3000");
});