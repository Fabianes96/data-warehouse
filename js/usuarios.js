import * as global from './global.js';
import {MD5} from './utils.js';

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
        clearUsuariosForm();
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
async function addUsuarios(contadorSeleccionadas){
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
    tr.setAttribute("class","to-be-checked-usuario");
    inputDiv.addEventListener("change",(e)=>{
      let sp = global.nroSeleccionUser.firstElementChild;
      if(e.currentTarget.checked){
        tr.classList.add("tr-hover")
        contadorSeleccionadas++;
        sp.textContent = contadorSeleccionadas + " seleccionadas";
        global.opCabeceraUser.classList.remove("none");
        global.opCabeceraUser.classList.add("opciones-cabecera");
      }else{
        tr.classList.remove("tr-hover")
        contadorSeleccionadas = contadorSeleccionadas -1;         
        sp.textContent = contadorSeleccionadas + " seleccionadas";
        if(contadorSeleccionadas==0){
          global.opCabeceraUser.classList.remove("opciones-cabecera");
          global.opCabeceraUser.classList.add("none");            
          global.flexCheckUsuarios.checked = false;            
        }
      }        
    })
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
    divOpciones.setAttribute("class", "div-opciones");
    let spanLinkPrimary = document.createElement("span");
    spanLinkPrimary.setAttribute("class","link-primary")
    let iconEdit = document.createElement("i");
    iconEdit.setAttribute("class","far");
    iconEdit.classList.add("fa-edit");
    iconEdit.setAttribute("data-bs-toggle","modal")
    iconEdit.setAttribute("data-bs-target","#modalUsuarios")    
    iconEdit.addEventListener("click",()=>{
      global.inputModalUsuarioNombre.value = arrayUsuarios[i].nombre;
      global.inputModalUsuarioApellido.value = arrayUsuarios[i].apellido;
      global.inputModalUsuarioEmail.value = arrayUsuarios[i].email;
      global.modalUsuarios.setAttribute("uid",arrayUsuarios[i].id)
      if(arrayUsuarios[i].perfil == 1){        
        global.usuarioPerfil.value = 1;
      }else{
        global.usuarioPerfil.value = "Básico"
      }      
    })
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
      global.labelWarning.setAttribute("usuario",arrayUsuarios[i].id);  
    })
    spanLinkDanger.appendChild(iconDelete);
    divOpciones.appendChild(spanLinkPrimary);
    divOpciones.appendChild(spanLinkDanger);
    tdAcciones.appendChild(divOpciones);
    tr.appendChild(tdAcciones);

    global.bodyTablaUsuarios.appendChild(tr)
  }
}
function toCheckUser(e,contadorSeleccionadas){
  let checklist = document.getElementsByClassName("to-be-checked-usuario");
  if(e.currentTarget.checked){    
    for (let i = 0; i < checklist.length; i++) {            
      checklist[i].classList.add("tr-hover")
      let th = checklist[i].firstElementChild;
      let div = th.firstElementChild
      let check = div.firstElementChild
      check.checked = true      
    }
    contadorSeleccionadas = checklist.length;
    global.nroSeleccionUser.firstElementChild.textContent = contadorSeleccionadas + " selecciondas";    
  }
  else{
    for (let i = 0; i < checklist.length; i++) {      
      checklist[i].classList.remove("tr-hover");
      let th = checklist[i].firstElementChild;
      let div = th.firstElementChild
      let check = div.firstElementChild
      check.checked = false
    }    
    contadorSeleccionadas = 0;  
  }
  if(!(e.currentTarget.checked && global.opCabeceraUser.classList.contains("opciones-cabecera"))){
    global.opCabeceraUser.classList.toggle("none");
    global.opCabeceraUser.classList.toggle("opciones-cabecera");
  }
}
async function editUsuario(id, perfil){
  try {
    let p = "1"
    if(perfil == "Básico"){
      p = "0";
    }
    let res = await fetch(`http://localhost:3000/usuarios/${id}`,{
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body:JSON.stringify({
        nombre: global.inputModalUsuarioNombre.value,
        apellido: global.inputModalUsuarioApellido.value,
        email: global.inputModalUsuarioEmail.value,
        perfil: p        
      })
    });    
    return res;
    
  } catch (error) {
    console.log(error);
  }
}
async function editPassword(id){
  try {         
    let res = await fetch(`http://localhost:3000/usuarios/${id}/password`,{
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body:JSON.stringify({
        password: MD5(global.newPasswordUsuario.value),        
      })          
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
async function deleteUsuario(id){
  try {
    const res = await fetch(`http://localhost:3000/usuarios/${id}`,{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },      
    })        
    if(!res.ok){
      throw 'Error al eliminar los datos';
    }      
  } catch (error) {
    console.log(error);
  }
}
function clearUsuariosForm(){
  global.inputNombre.value = "";
  global.inputApellido.value ="";
  global.inputEmailUsuario.value = "";  
  global.inputPasswordUsuario.value = "";
  global.repeatPasswordUsuario.value = "";
  global.addUsersForm.classList.remove("was-validated")
}
function clearUsuariosModal(){
  global.inputModalUsuarioNombre.value = "";
  global.inputModalUsuarioApellido.value = "";
  global.inputModalUsuarioEmail.value = "";
  global.formUsuario.classList.remove("was-validated");
  global.inputEditPasswordUsuario.removeAttribute("required")
  global.newPasswordUsuario.removeAttribute("required");
  global.changePassword.classList.remove("none");  
  global.divPassword.classList.add("none");    
}

export {noLinkUsuarios, crearUsuarios, addUsuarios, editUsuario, toCheckUser, deleteUsuario, editPassword,clearUsuariosModal}