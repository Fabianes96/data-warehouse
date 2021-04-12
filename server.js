//Declaraciones
const express = require("express");
const server = express();
const db = require("./db");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const utils = require("./utils.js")
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