//Declaraciones
const express = require("express");
const server = express();
const db = require("../js/db");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const utils = require("./utils");
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
server.get("/usuarios", authorization, isAdmin,async(req,res)=>{
  try {
    let consulta = await db.sequelize.query(
      `SELECT id, nombre, apellido, email, perfil FROM usuarios`
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
server.get("/usuarios/:id", authorization, isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    let consulta = await db.sequelize.query(
      `SELECT id, nombre, apellido, email, perfil, password FROM usuarios WHERE id = :id`
    ,{
      replacements:{
        id:id
      },type: db.sequelize.QueryTypes.SELECT,
    });    
    res.status(200)
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
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
      if(!email || !email.includes("@")){
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
});
server.patch("/usuarios/:id",authorization, isAdmin, async(req,res)=>{
  try {
    const id = req.params.id;
    const {nombre,apellido,email,perfil} = req.body;
    if(nombre== "" || nombre ==null){
      res.status(400);
      res.json("Debe ingresar el nombre");
      return;
    }
    if(apellido == "" || apellido ==null){
      res.status(400);
      res.json("Debe ingresar el apellido");
      return;
    }
    if(email == "" || email ==null || !email.includes("@")){
      res.status(400);
      res.json("Debe ingresar un correo");
      return;
    }
    let consulta = await db.sequelize.query("UPDATE usuarios SET nombre = :nombre, apellido = :apellido, email = :email, perfil = :perfil WHERE id = :id",{
      replacements:{
        id: id,
        nombre: nombre,
        apellido: apellido,
        email: email,
        perfil: perfil
      }, type: db.sequelize.QueryTypes.UPDATE
    });
    if(consulta.length === 0){
      res.status(404);
      res.json("Usuario no encontrado");
      return
    }
    res.status(200);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
server.patch("/usuarios/:id/password",authorization,isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    const password = req.body.password;
    if(password== "" || password ==null){
      res.status(400);
      res.json("Debe ingresar la contraseña");
      return;
    }    
    let consulta = await db.sequelize.query("UPDATE usuarios SET password = :password WHERE id = :id",{
      replacements:{
        id: id,
        password:password
      }, type: db.sequelize.QueryTypes.UPDATE
    });
    if(consulta.length === 0){
      res.status(404);
      res.json("Usuario no encontrado");
      return
    }
    res.status(200);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500);
  }
})
server.delete("/usuarios/:id",authorization,isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    let consulta = await db.sequelize.query("DELETE FROM usuarios WHERE id = :id",{
      replacements: {
        id: id,
      },type: db.sequelize.QueryTypes.DELETE
    });    
    res.status(200)
    console.log("Usuario eliminado");
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
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
server.get("/busqueda", authorization, async(req,res)=>{
  try {
    let busqueda = req.query.termino;    
    let consulta = await db.sequelize.query(`SELECT contactos.id, contactos.nombre AS nombre,contactos.apellido AS apellido, cargo, contactos.email AS email, companias.id AS id_compania, companias.nombre AS compania, paises.nombre AS pais, regiones.nombre AS region, interes.porcentaje, contactos.direccion AS direccion FROM contactos JOIN ciudades ON ciudades.id = contactos.ciudad JOIN paises ON paises.id = ciudades.pais JOIN companias ON contactos.compania = companias.id JOIN regiones ON regiones.id = paises.region JOIN interes ON contactos.interes = interes.id WHERE contactos.nombre LIKE :busqueda OR contactos.nombre LIKE :busquedaP OR contactos.apellido LIKE :busqueda OR contactos.apellido LIKE :busquedaP OR cargo LIKE :busqueda OR cargo LIKE :busquedaP OR companias.nombre LIKE :busqueda OR companias.nombre LIKE :busquedaP OR paises.nombre LIKE :busqueda OR paises.nombre LIKE :busquedaP OR regiones.nombre LIKE :busqueda OR regiones.nombre LIKE :busquedaP`,{
      replacements:{
        busqueda: `${busqueda}`,
        busquedaP: `%${busqueda}%`
      }, type: db.sequelize.QueryTypes.SELECT,
    });
    res.status(200);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
})
server.get("/contactos/",authorization, async(req,res)=>{
  try {
    let consulta = await db.sequelize.query("SELECT contactos.id, contactos.nombre AS nombre,contactos.apellido AS apellido, cargo, contactos.email AS email, companias.id AS id_compania, companias.nombre AS compania,paises.id AS id_pais, paises.nombre AS pais, regiones.id AS id_region, regiones.nombre AS region, interes.porcentaje, contactos.direccion AS direccion, ciudades.id AS id_ciudad FROM contactos JOIN ciudades ON ciudades.id = contactos.ciudad JOIN paises ON paises.id = ciudades.pais JOIN companias ON contactos.compania = companias.id JOIN regiones ON regiones.id = paises.region JOIN interes ON contactos.interes = interes.id ORDER BY contactos.id",{
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
server.post("/contactos",authorization,isAdmin,async(req,res)=>{
  try {
    const {nombre,apellido,cargo,email,compania,ciudad,interes,direccion} = req.body
    if(!(nombre ||apellido ||cargo||email||compania||ciudad||interes||direccion)){
      res.status(400);
      res.json("Falta algún parámetro");
      return
    }
    if(!email.includes("@")){
      res.status(400);
      res.json("Debe escribir un correo");
      return
    }
    let consulta = await db.sequelize.query("INSERT into contactos (nombre,apellido,cargo,email,compania,ciudad,interes,direccion) VALUES(:nombre, :apellido, :cargo, :email, :compania, :ciudad, :interes, :direccion)",{
      replacements:{
        nombre: nombre,
        apellido: apellido,
        cargo: cargo,
        email: email,
        compania: compania,
        ciudad: ciudad,
        interes: interes,
        direccion: direccion
      }, type: db.sequelize.QueryTypes.INSERT
    })
    console.log("Contacto añadido");
    res.status(201);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500); 
    res.json("Ha ocurrido un error inesperado");
  }
});
server.patch("/contactos/:id",authorization,isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    const {nombre, apellido, cargo, email, compania,ciudad,interes,direccion} = req.body;
    if(!nombre || !email || !direccion || !apellido || !ciudad || !cargo || !compania ||!interes){
      res.status(400);
      res.json("Falta algún parámetro");
      return;
    } 
    let consulta = await db.sequelize.query("UPDATE contactos SET nombre = :nombre, apellido = :apellido, cargo = :cargo, email = :email, compania = :compania, ciudad = :ciudad, interes = :interes, direccion = :direccion WHERE id = :id",{
      replacements:{
        id: id,
        nombre: nombre,
        apellido: apellido,
        cargo: cargo,
        email: email,
        compania: compania,
        ciudad: ciudad,
        interes: interes,
        direccion: direccion,        
      }, type: db.sequelize.QueryTypes.UPDATE
    });
    if(consulta.length === 0){
      res.status(404);
      res.json("Contacto no encontrado");
      return
    }
    res.status(200);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
server.get("/canalesporcontactos",authorization,async(req,res)=>{
  try {
    const contacto = req.query.contacto;    
    let consulta = await db.sequelize.query(`SELECT canalesPorContactos.id AS id, canales.id AS id_canal, canales.nombre AS canal, preferencias.id AS id_preferencia, preferencias.nombre AS preferencia, cuenta  FROM canalesPorContactos JOIN canales ON canales.id = canalesPorContactos.canal JOIN preferencias ON preferencias.id = canalesPorContactos.preferencia WHERE contacto = :contacto`,{
      replacements:{
        contacto: contacto
      }, type: db.sequelize.QueryTypes.SELECT
    });
    res.status(200);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.patch("/canalesporcontactos/:id",authorization,isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    const {canal, preferencia, cuenta} = req.body;
    if(!canal || !preferencia|| !cuenta){
      res.status(400);
      res.json("Falta algún parámetro");
      return;
    } 
    let consulta = await db.sequelize.query("UPDATE canalesPorContactos SET canal = :canal, preferencia = :preferencia, cuenta = :cuenta WHERE id = :id",{
      replacements:{
        id: id,        
        canal: canal,
        preferencia: preferencia,
        cuenta: cuenta
      }, type: db.sequelize.QueryTypes.UPDATE
    });
    if(consulta.length === 0){
      res.status(404);
      res.json("Registro no encontrado");
      return
    }
    res.status(200);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500);
  }
})
server.post("/canalesporcontactos",authorization,isAdmin, async(req,res)=>{
  try {
    const {contacto, canal, preferencia,cuenta} = req.body;
    if(!(contacto || canal || preferencia || cuenta)){
      res.status(400);
      res.json("Falta algún parámetro");
      return
    }
    let consulta = await db.sequelize.query("INSERT INTO canalesPorContactos (contacto, canal, preferencia, cuenta) VALUES (:contacto, :canal, :preferencia, :cuenta)", {
      replacements:{
        contacto: contacto,
        canal: canal,
        preferencia: preferencia,
        cuenta: cuenta
      }, type: db.sequelize.QueryTypes.INSERT
    });
    console.log("Cuenta añadida");
    res.status(201);
    res.json(consulta);    
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.delete("/canalesporcontactos/:id",authorization,isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    let consulta = await db.sequelize.query("DELETE FROM canalesPorContactos WHERE id = :id",{
      replacements: {
        id: id,
      },type: db.sequelize.QueryTypes.DELETE
    });    
    res.status(200)
    console.log("Registro eliminado");
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
})
server.delete("/contactos/:id",authorization, isAdmin,async(req,res)=>{
  try {
    const id = req.params.id;
    let consulta = await db.sequelize.query("DELETE FROM contactos WHERE id = :id",{
      replacements: {
        id: id,
      },type: db.sequelize.QueryTypes.DELETE
    });    
    res.status(200)
    console.log("Contacto eliminado");
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.get("/canales",authorization,async(req,res)=>{
  try {
    let consulta = await db.sequelize.query("SELECT * FROM canales",{
      type: db.sequelize.QueryTypes.SELECT
    });      
    res.status(200);
    res.json(consulta)
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.get("/preferencias",authorization,async(req,res)=>{
  try {
    let consulta = await db.sequelize.query("SELECT * FROM preferencias",{
      type: db.sequelize.QueryTypes.SELECT
    });      
    res.status(200);
    res.json(consulta)
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.listen(process.env.PORT || 3000, () => {
    console.log("Server on port 3000");
});