import * as global from './global.js';

function noLinkUsuarios(){
    global.opcionesContactos.classList.remove("none");
    global.contactos.classList.remove("none");
    global.usuarios.classList.add("none");
}

async function crearUsuarios(){
    let admin = "0";
    if(global.perfil.value =="Admin"){
      admin = "1"
    }
    try {
      const res = await fetch("http://localhost:3000/usuarios",{
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
            nombre: global.inputNombre.value,
            apellido: global.inputApellido.value,          
            email: global.inputEmailUsuario.value,
            perfil: admin,
            password: global.inputPasswordUsuario.value
        })
      })
      if(!res.ok){
        throw "Error al registrar usuario";
      }else{
        global.inputNombre.value = "";
        global.inputApellido.value ="";
        global.inputEmailUsuario.value = "";
        admin = "";
        global.inputPasswordUsuario.value = "";
        console.log("Usuario registrado con exito");    
      }      
    } catch (error) {    
      console.log("Algo salió mal: ", error);
    }
}

export {noLinkUsuarios, crearUsuarios}