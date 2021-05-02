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
async function getusuarios(){
  try {
    let res = await fetch("http://localhost:3000/usuarios",{      
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },      
    })
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
async function addUsuarios(){
  let arrayUsuarios = await getusuarios();
  for (let i = 0; i < arrayUsuarios.length; i++) {    
    let tr = document.createElement("tr");
    tr.setAttribute("uid",arrayUsuarios[i].id)
    let th = document.createElement("th");
    th.setAttribute("scope","row");
    let divCheck = document.createElement("div")
    divCheck.setAttribute("class","form-check");
    let inputDiv = document.createElement("input");
    inputDiv.setAttribute("class","form-check-input")
    inputDiv.setAttribute("type","checkbox");
    tr.setAttribute("class","to-be-checked");
      // inputDiv.addEventListener("change",(e)=>{
    //   let sp = global.nroSeleccion.firstElementChild;
    //   if(e.currentTarget.checked){
    //     tr.classList.add("tr-hover")
    //     contadorSeleccionadas++;
    //     sp.textContent = contadorSeleccionadas + " seleccionadas";
    //     global.opCabecera.classList.remove("none");
    //     global.opCabecera.classList.add("opciones-cabecera");
    //   }else{
    //     tr.classList.remove("tr-hover")
    //     contadorSeleccionadas = contadorSeleccionadas -1;         
    //     sp.textContent = contadorSeleccionadas + " selecciondas";
    //     if(contadorSeleccionadas==0){
    //       global.opCabecera.classList.remove("opciones-cabecera");
    //       global.opCabecera.classList.add("none");            
    //       global.flexCheck.checked = false;            
    //     }
    //   }        
    // })
    let label = document.createElement("label");
    label.setAttribute("class", "form-check-label");
    divCheck.appendChild(inputDiv);
    divCheck.appendChild(label)
    th.appendChild(divCheck);
    tr.appendChild(th);

    let td = document.createElement("td");
    td.textContent = arrayUsuarios[i].nombre;    
    tr.appendChild(td)

    let tdApellido = document.createElement("td");
    tdApellido.textContent = arrayUsuarios[i].apellido
    tr.appendChild(tdApellido)

    let tdEmail = document.createElement("td");
    tdEmail.textContent = arrayUsuarios[i].email
    tr.appendChild(tdEmail)

    let tdPerfil = document.createElement("td");
    if(arrayUsuarios[i].perfil == 0){
      tdPerfil.textContent = "Básico" 
    }else{
      tdPerfil.textContent = "Admin"
    }    
    tr.appendChild(tdPerfil)

    let tdAcciones = document.createElement("td");
    let divOpciones = document.createElement("div");
    divOpciones.setAttribute("class", "div-opciones-usuarios");
    let spanLinkPrimary = document.createElement("span");
    spanLinkPrimary.setAttribute("class","link-primary")
    let iconEdit = document.createElement("i");
    iconEdit.setAttribute("class","far");
    iconEdit.classList.add("fa-edit");
    iconEdit.setAttribute("data-bs-toggle","modal")
    iconEdit.setAttribute("data-bs-target","#modalAddContactos")
    spanLinkPrimary.appendChild(iconEdit);
    let spanLinkDanger = document.createElement("span");
    spanLinkDanger.setAttribute("class","link-danger");
    let iconDelete = document.createElement("i");
    iconDelete.setAttribute("class","far")
    iconDelete.classList.add("fa-times-circle");    
    iconDelete.setAttribute("data-bs-target","#warningModal");
    iconDelete.setAttribute("data-bs-toggle","modal")
    iconDelete.addEventListener("click",()=>{
      global.labelWarning.textContent = `Está seguro que desea eliminar este usuario?`
      global.labelWarning.setAttribute("contacto",arrayUsuarios[i].id);  
    })
    spanLinkDanger.appendChild(iconDelete);
    divOpciones.appendChild(spanLinkPrimary);
    divOpciones.appendChild(spanLinkDanger);
    tdAcciones.appendChild(divOpciones);
    tr.appendChild(tdAcciones);

    global.bodyTablaUsuarios.appendChild(tr)
  }
}

export {noLinkUsuarios, crearUsuarios, addUsuarios}