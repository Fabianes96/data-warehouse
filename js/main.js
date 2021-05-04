import * as global from "./global.js";
import * as usuarios from './usuarios.js';
import * as compania from './compania.js';
import * as regiones from './regiones.js';
import * as contacto from './contactos.js';

let objeto = {
  "region": {      
  }
}
let arrayCompanias = [];
let arrayContactos = [];
let flag = false;
let flagCompanias = false;
let contadorSeleccionadas = 0;
let contadorSeleccionadasUser = 0;
let user = "";

window.onload = ()=>{
  comprobacion()
  setTimeout(async()=>{
    arrayContactos = await contacto.loadContactos()
    contacto.addContactos(arrayContactos,arrayCompanias,contadorSeleccionadas);
  },500);
}
window.onclick = function(e){      
  if(e.target == global.modal || e.target == global.btnClose || e.target == global.xClose){    
    global.modalLabel.textContent = "";
    global.labelAddInModal.textContent = "";
    global.inputModal.value = ""    
    global.labelAddInModal.removeAttribute("region");
    global.labelAddInModal.removeAttribute("pais");
    global.labelAddInModal.removeAttribute("epais");
    global.labelAddInModal.removeAttribute("eciudad");
  }
  if(e.target == global.modalCompania || e.target == global.btnCloseCompania || e.target == global.xCloseCompania){
    compania.clearModalCompania()
  }
  if(e.target == global.modalAddContactos || e.target == global.btnCloseModalAddContactos || e.target == global.btnCancelModalAddContacto){
    contacto.clearModalContactos();
  }
}
global.cerrarSesion.addEventListener("click",()=>{
  localStorage.removeItem("jwt");
  window.location.href = "/login.html";
});
global.linkContactos.addEventListener("click",async()=>{
  global.opcionesContactos.classList.add("none");
  global.regiones.classList.add("none")
  global.usuarios.classList.add("none");
  global.companias.classList.add("none");
  global.contactos.classList.remove("none");
  global.opCabecera.classList.add("none");
  global.opCabecera.classList.remove("opciones-cabecera");
  contadorSeleccionadas = 0;
  global.flexCheck.checked = false
  if(global.bodyTablaContactos.firstElementChild){
    global.clearOptions(global.bodyTablaContactos)
  }
  arrayContactos = await contacto.loadContactos();
  contacto.addContactos(arrayContactos,arrayCompanias,contadorSeleccionadas)
});
global.divSearch.addEventListener("click",async()=>{
  if(!global.inputSearch.value ==""){
    try {
      let res = await fetch(`http://localhost:3000/busqueda?termino=${global.inputSearch.value}`,{
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },        
      });
      global.coincidencias.firstElementChild.textContent = global.inputSearch.value;
      global.coincidencias.classList.remove("none");
      arrayContactos = await res.json();
      global.clearOptions(global.bodyTablaContactos);
      contacto.addContactos(arrayContactos,arrayCompanias,contadorSeleccionadas);
    } catch (error) {
      console.log("Algo salió mal ", error);
    }
  }
})
global.inputSearch.addEventListener("keypress",async(e)=>{
  if(e.key === "Enter"){
    if(!global.inputSearch.value ==""){
      try {
        let res = await fetch(`http://localhost:3000/busqueda?termino=${global.inputSearch.value}`,{
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },        
        });
        arrayContactos = await res.json();
        global.coincidencias.firstElementChild.textContent = global.inputSearch.value;
        global.coincidencias.classList.remove("none");
        global.clearOptions(global.bodyTablaContactos);
        contacto.addContactos(arrayContactos,arrayCompanias,contadorSeleccionadas)
      } catch (error) {
        console.log("Algo salió mal ", error);
      }
    }  
  }
})
global.linkCompanias.addEventListener("click",async()=>{
  global.opcionesContactos.classList.add("none");
  global.contactos.classList.add("none");
  global.regiones.classList.add("none")
  global.usuarios.classList.add("none");
  global.companias.classList.remove("none");    
  global.clearOptions(global.bodyTabla);
  arrayCompanias = await compania.getCompanias();  
  compania.addCompaniesToTable(arrayCompanias);
});
global.linkUsuarios.addEventListener("click",async()=>{
  global.opcionesContactos.classList.add("none");
  global.contactos.classList.add("none");
  global.companias.classList.add("none");
  global.regiones.classList.add("none")    
  global.usuarios.classList.remove("none");
  global.opCabeceraUser.classList.add("none");
  global.opCabeceraUser.classList.remove("opciones-cabecera");
  contadorSeleccionadasUser = 0;  
  global.flexCheckUsuarios.checked = false
  if(global.bodyTablaUsuarios.firstElementChild){
    global.clearOptions(global.bodyTablaUsuarios)
  }
  await usuarios.addUsuarios(contadorSeleccionadasUser);
});
global.linkRegiones.addEventListener("click",async()=>{  
  global.opcionesContactos.classList.add("none");
  global.contactos.classList.add("none");
  global.companias.classList.add("none");
  global.usuarios.classList.add("none");
  global.regiones.classList.remove("none");  
  while(global.regionCiudad.firstElementChild){
    global.regionCiudad.removeChild(global.regionCiudad.firstElementChild);
    objeto = {
      "region": {      
      }
    }
  }
  await regiones.queryToJSON(objeto)
});
global.flexCheck.addEventListener("change",(e)=>{
  contacto.toCheck(e)
});
global.flexCheckUsuarios.addEventListener("change",(e)=>{
  usuarios.toCheckUser(e,contadorSeleccionadasUser)
})
global.btnCrearUsuario.addEventListener("click",async(e)=>{
  try {
    if(global.inputPasswordUsuario.value.length >=4 && global.inputPasswordUsuario.value == global.repeatPasswordUsuario.value){
      e.preventDefault()
      await usuarios.crearUsuarios();
      global.addUsersForm.lastElementChild.classList.remove("none");
      setTimeout(()=>{      
        global.addUsersForm.lastElementChild.classList.add("none");
      },10000);
    }
  } catch (error) {
    console.log(error);
  }
})
global.btnAceptarModal.addEventListener("click",async()=>{
  try {    
    if(global.labelAddInModal.getAttribute("region")){
      const res = await fetch("http://localhost:3000/paises",{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body:JSON.stringify({
        nombre: global.inputModal.value,
        region: global.labelAddInModal.getAttribute("region")
      })
    })
      global.inputModal.value = "";
      global.labelAddInModal.removeAttribute("region");      
      let mensaje = await res.json()      
      if(!res.ok){
        throw mensaje;
      }      
      global.btnClose.click()
      global.linkRegiones.click();
    } else if(global.labelAddInModal.getAttribute("pais")){      
      const res = await fetch("http://localhost:3000/ciudades",{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body:JSON.stringify({
        nombre: global.inputModal.value,
        pais: global.labelAddInModal.getAttribute("pais")
      })
    })
      if(!res.ok){
        let mensaje = await res.json()        
        throw mensaje;
      }      
      global.inputModal.value = "";
      global.labelAddInModal.removeAttribute("pais");      
      global.btnClose.click()
      global.linkRegiones.click();
    
    }else if(global.labelAddInModal.getAttribute("epais")){
      const res = await fetch(`http://localhost:3000/paises/${global.labelAddInModal.getAttribute("epais")}`,{
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body:JSON.stringify({
        nombre: global.inputModal.value,        
      })
    })
      global.inputModal.value = "";
      global.labelAddInModal.removeAttribute("epais");      
      let mensaje = await res.json()      
      if(!res.ok){
        throw mensaje;
      }
      global.btnClose.click()
      global.linkRegiones.click();
    }else if(global.labelAddInModal.getAttribute("eciudad")){
      const res = await fetch(`http://localhost:3000/ciudades/${global.labelAddInModal.getAttribute("eciudad")}`,{
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body:JSON.stringify({
        nombre: inputModal.value,        
      })
    })
      global.inputModal.value = "";
      global.labelAddInModal.removeAttribute("eciudad");      
      let mensaje = await res.json()      
      if(!res.ok){
        throw mensaje;
      }
      global.btnClose.click()
      global.linkRegiones.click();
    }else if(flag){
      try {
        const res = await fetch("http://localhost:3000/regiones",{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },
          body:JSON.stringify({
            nombre: inputModal.value,        
          })
        });
        global.inputModal.value = "";        
        flag = false;
        let mensaje = await res.json()
        if(!res.ok){
          throw mensaje
        }
        global.btnClose.click()
        global.linkRegiones.click();
      } catch (error) {
        console.log(error);
      }
    }else if(global.labelAddInModal.getAttribute("eregion")){
      const res = await fetch(`http://localhost:3000/regiones/${global.labelAddInModal.getAttribute("eregion")}`,{
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body:JSON.stringify({
        nombre: global.inputModal.value,        
      })
    })
      global.inputModal.value = "";
      global.labelAddInModal.removeAttribute("eregion");      
      let mensaje = await res.json()      
      if(!res.ok){
        throw mensaje;
      }
      global.btnClose.click()
      global.linkRegiones.click();
    }
  } catch (error) {
    console.log(error);
  }
});
global.btnAgregarRegion.addEventListener("click",()=>{
  global.modalLabel.textContent = "Agregar región";
  global.labelAddInModal.textContent = "Escriba el nombre de la región a agregar";  
  flag = true
});
global.btnEliminarModalAddContacto.addEventListener("click",()=>{
  global.labelWarning.textContent = `Está seguro que desea eliminar este contacto?`
  global.labelWarning.setAttribute("contacto",global.modalAddContactos.getAttribute("id_c"));  
})
global.btnEliminar.addEventListener("click",async()=>{
  try {
    if(global.labelWarning.getAttribute("pais")){
      const res = await fetch(`http://localhost:3000/paises/${global.labelWarning.getAttribute("pais")}`,{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },      
    })      
    global.labelWarning.removeAttribute("pais");            
      if(!res.ok){
        throw 'Error al eliminar los datos';
      }
      global.cancelWarningModal.click()
      global.linkRegiones.click();      
    }else if(global.labelWarning.getAttribute("ciudad")){
      const res = await fetch(`http://localhost:3000/ciudades/${global.labelWarning.getAttribute("ciudad")}`,{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },      
    })      
      global.labelWarning.removeAttribute("ciudad");            
      if(!res.ok){
        throw 'Error al eliminar los datos';
      }
      global.cancelWarningModal.click()
      global.linkRegiones.click();      
    } else if(global.labelWarning.getAttribute("region")){
      const res = await fetch(`http://localhost:3000/regiones/${global.labelWarning.getAttribute("region")}`,{
        method: 'DELETE',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },      
      })      
        global.labelWarning.removeAttribute("region");            
        if(!res.ok){
          throw 'Error al eliminar los datos';
        }
        global.cancelWarningModal.click()
        global.linkRegiones.click();          
    } else if(global.labelWarning.getAttribute("compania")){
      const res = await fetch(`http://localhost:3000/companias/${global.labelWarning.getAttribute("compania")}`,{
        method: 'DELETE',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },      
      })      
      global.labelWarning.removeAttribute("region");            
        if(!res.ok){
          throw 'Error al eliminar los datos';
        }
      global.cancelWarningModal.click()
      global.linkCompanias.click();
    } else if(global.labelWarning.getAttribute("contacto")){
      await contacto.deleteContacto(global.labelWarning.getAttribute("contacto"));      
      global.labelWarning.removeAttribute("contacto");
      global.cancelWarningModal.click()
      global.btnCancelModalAddContacto.click()
      global.linkContactos.click();
    }else if(global.labelWarning.getAttribute("contactos-varios")){
      let allChecked = document.getElementsByClassName("tr-hover");
      for (let i = 0; i < allChecked.length; i++) {    
        await contacto.deleteContacto(allChecked[i].attributes.cid.value);    
      }      
      global.labelWarning.removeAttribute("contactos-varios");
      global.cancelWarningModal.click()
      global.linkContactos.click();
    } else if(global.labelWarning.getAttribute("usuarios")){
      let allChecked = document.getElementsByClassName("tr-hover");
      for (let i = 0; i < allChecked.length; i++){    
        await usuarios.deleteUsuario(allChecked[i].attributes.uid.value);    
      }      
      global.cancelWarningModal.click()
      global.linkUsuarios.click();
    } else if(global.labelWarning.getAttribute("usuario")){      
      await usuarios.deleteUsuario(global.labelWarning.getAttribute("usuario"));      
      global.labelWarning.removeAttribute("usuario");
      global.cancelWarningModal.click()
      global.linkUsuarios.click();
    }        
  } catch (error) {
    console.log(error);
  }
});

global.btnAceptarModalCompania.addEventListener("click",async(e)=>{
  e.preventDefault()
  await compania.companiaActionsInModal();
  global.btnCloseCompania.click()
  global.linkCompanias.click();
})

global.btnAddCompanias.addEventListener("click",async()=>{
  await regiones.loadOptions(global.optionsGroup);  
})

global.btnAddContactos.addEventListener("click",async()=>{  
  global.btnCancelModalAddContacto.classList.remove("none");
  global.btnAddNuevoContacto.classList.remove("none");
  global.btnEditarNuevoContacto.classList.add("none");
  global.btnEliminarModalAddContacto.classList.add("none");
  global.tituloModalContacto.textContent = "Nuevo contacto";
  await compania.loadCompaniaToModal(arrayCompanias);
  await regiones.loadOptions(global.optionsGroupContactos);
  await contacto.loadCanales(global.selectCanal);  
})

global.agregarCanal.addEventListener("click",async()=>{
  if(global.selectCanal.value!="" && global.inputCuentaContacto.value != "" && global.selectPreferencia.value != ""){
    await contacto.addCanalToModal(global.selectCanal.value,global.inputCuentaContacto.value,global.selectPreferencia.value,false);
    global.selectCanal.value = ""
    global.inputCuentaContacto.value = ""
    global.selectPreferencia.value = ""
  }
})

global.linkEliminar.addEventListener("click", async()=>{
  global.labelWarning.textContent = `Está seguro que desea eliminar los contactos seleccionados?`
  global.labelWarning.setAttribute("contactos-varios","true");    
});

global.btnAddContactoForm.addEventListener("click",async(e)=>{    
  if(global.btnAddContactoForm.getAttribute("add")==""){
    await contacto.addContactoForm();  
  }else if(global.btnAddContactoForm.getAttribute("edit") == ""){    
    e.preventDefault()
    await contacto.editContactoForm();
    global.btnCancelModalAddContacto.click()
    global.linkContactos.click();            
  }
});
global.btnAddNuevoContacto.addEventListener("click",async()=>{  
  global.btnAddContactoForm.setAttribute("add","")
  await global.btnAddContactoForm.click();
});
global.btnEditarNuevoContacto.addEventListener("click",async()=>{
  global.btnAddContactoForm.setAttribute("edit","")
  await global.btnAddContactoForm.click();
});
global.optionsGroup.addEventListener("change",async()=>{
  await regiones.loadPaises(global.optionsPais,global.optionsGroup)  
});
global.optionsPais.addEventListener("change",async()=>{
  await regiones.loadCiudades(global.optionsCiudad,global.optionsPais);
});
global.selectRegionContactos.addEventListener("change",async()=>{
  await regiones.loadPaises(global.selectPaisContactos,global.selectRegionContactos);
});
global.selectPaisContactos.addEventListener("change",async()=>{
  await regiones.loadCiudades(global.selectCiudadContactos,global.selectPaisContactos);
});
global.selectCanal.addEventListener("click",async()=>{
  await contacto.loadPreferencias(global.selectPreferencia);
});
global.selectCiudadContactos.addEventListener("change",()=>{  
  global.inputModalContactoDireccion.disabled = false;  
});
global.btnAceptarModalUsuario.addEventListener("click",async(e)=>{
  try {    
    e.preventDefault();
    if(!global.divPassword.classList.contains("none")){
      if((global.inputEditPasswordUsuario.value != "" && global.newPasswordUsuario.value != "")){          
        if(global.inputEditPasswordUsuario.value == global.newPasswordUsuario.value){          
          let res = await usuarios.editPassword(user[0].id);          
          if(!res.ok){            
            throw 'Error al actualizar los datos'
          }else{            
            let resC = await usuarios.editUsuario(global.modalUsuarios.getAttribute("uid"),global.usuarioPerfil.value);                  
            if(resC.ok){                            
              usuarios.clearUsuariosModal()
              global.btnCloseModalUsuario.click();
              global.linkUsuarios.click()
            }
            else{
              throw 'Error al actualizar los datos'
            }
          }
        }
      }       
    }else{      
      let res = await usuarios.editUsuario(global.modalUsuarios.getAttribute("uid"),global.usuarioPerfil.value);   
      if(res.ok){        
        usuarios.clearUsuariosModal()
        global.btnCloseModalUsuario.click();
        global.linkUsuarios.click()
      }       
      else{        
        throw 'Error al actualizar los datos'
      }
    }        
  } catch (error) {
    console.log(error);
  }
});
global.toAddUserForm.addEventListener("click",()=>{
  global.userHeader.classList.add("none");
  global.addUsersForm.classList.remove("none");
  global.divUsersTable.classList.add("none")
});
global.spanListaUsuarios.addEventListener("click",async()=>{  
  global.clearOptions(global.bodyTablaUsuarios)  
  await usuarios.addUsuarios(contadorSeleccionadasUser);  
  global.userHeader.classList.remove("none");
  global.addUsersForm.classList.add("none");
  global.divUsersTable.classList.remove("none")
});
global.eliminarUsuarios.addEventListener("click",()=>{
  global.labelWarning.textContent = `Está seguro que desea eliminar los usuarios seleccionados?`
  global.labelWarning.setAttribute("usuarios","true");      
});
global.changePassword.addEventListener("click",async()=>{
  try {
    let res = await fetch(`http://localhost:3000/usuarios/${global.modalUsuarios.getAttribute("uid")}`,{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },        
    });    
    user = await res.json();    
    global.inputEditPasswordUsuario.setAttribute("required", "");
    global.newPasswordUsuario.setAttribute("required", "");
    global.changePassword.classList.add("none");  
    global.divPassword.classList.remove("none");    
  } catch (error) {
    console.log(error);
  }
});
global.formUsuario.addEventListener("input",()=>{
  if(!global.divPassword.classList.contains("none")){
    global.newPasswordUsuario.setCustomValidity(global.newPasswordUsuario.value != global.inputEditPasswordUsuario.value ? global.invalidNewPass.textContent = "Las contraseñas no son iguales" : "");
  }  
});
global.addUsersForm.addEventListener("input",()=>{
  global.inputPasswordUsuario.setCustomValidity(global.inputPasswordUsuario.value.length < 4 ? global.invalidPassLenght.textContent = "La contraseña debe tener al menos 4 caracteres" : "");
  global.repeatPasswordUsuario.setCustomValidity(global.repeatPasswordUsuario.value != global.inputPasswordUsuario.value ? global.invalidPass.textContent = "Las contraseñas no son iguales" : "");
});

global.closeTag.addEventListener("click",()=>{
  global.inputSearch.value = ""
  global.coincidencias.classList.add("none");
  global.linkContactos.click();
})

function activeLink(){
  let menu = document.getElementById("menu");
  let a = menu.getElementsByClassName("links");      
  for (let i = 0; i < a.length; i++) {
    a[i].addEventListener("click",()=>{
      let current = document.getElementsByClassName("active");      
      if(current.length > 0){
        current[0].classList.add("no-selected");
        current[0].classList.remove("active");    
      }      
      a[i].classList.remove("no-selected")
      a[i].classList.add("active")
      if(i==0){
          usuarios.noLinkUsuarios()
      }
    })
  }
}
function comprobacion(){
  let jwt = localStorage.getItem("jwt");
  if(!jwt){
    window.location.href = "/login.html"
  }  
  let token = jwt.split(".");
  let perfil = JSON.parse(atob(token[1]))
  if(perfil.perfil!=1){
    global.linkUsuarios.parentNode.removeChild(global.linkUsuarios)    
  }else{
    global.linkUsuarios.firstElementChild.textContent = "Usuarios";
  }  
}
activeLink()
global.formB()
