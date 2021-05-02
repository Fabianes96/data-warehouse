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
window.onload = ()=>{
  comprobacion()
  setTimeout(async()=>{
    arrayContactos = await contacto.loadContactos()
    contacto.addContactos(arrayContactos,arrayCompanias);
  },500);
}
global.linkContactos.addEventListener("click",async()=>{
  global.opcionesContactos.classList.add("none");
  global.regiones.classList.add("none")
  global.usuarios.classList.add("none");
  global.companias.classList.add("none");
  global.contactos.classList.remove("none");
  if(global.bodyTablaContactos.firstElementChild){
    global.clearOptions(global.bodyTablaContactos)
  }
  arrayContactos = await contacto.loadContactos();
  contacto.addContactos(arrayContactos,arrayCompanias)
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
      arrayContactos = await res.json();
      global.clearOptions(global.bodyTablaContactos);
      contacto.addContactos(arrayContactos,arrayCompanias);
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
        global.clearOptions(global.bodyTablaContactos);
        contacto.addContactos(arrayContactos,arrayCompanias)
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
global.linkUsuarios.addEventListener("click",()=>{
  global.opcionesContactos.classList.add("none");
  global.contactos.classList.add("none");
  global.companias.classList.add("none");
  global.regiones.classList.add("none")    
  global.usuarios.classList.remove("none");
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
})
global.btnCrearUsuario.addEventListener("click",async()=>{
  await usuarios.crearUsuarios()
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
      console.log("Pais registrado");
      window.location.reload();
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
      console.log("Ciudad registrada");
      global.inputModal.value = "";
      global.labelAddInModal.removeAttribute("pais");      
      window.location.reload();      
    
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
      console.log("Pais actualizado");
      window.location.reload();
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
      console.log("Ciudad actualizada");
      window.location.reload();
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
        console.log("Región agregada con exito");
        window.location.reload()
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
      console.log("Región actualizada");
      window.location.reload();
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
      console.log("Pais eliminado");      
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
      console.log("Ciudad eliminada");      
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
        console.log("Región eliminada");      
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
        console.log("Compania eliminada");      
    } else if(global.labelWarning.getAttribute("contacto")){
      contacto.deleteContacto(global.labelWarning.getAttribute("contacto"));      
      global.labelWarning.removeAttribute("contacto");
    }
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
});

global.btnAceptarModalCompania.addEventListener("click",async()=>{
  await compania.companiaActionsInModal();
})

global.btnAddCompanias.addEventListener("click",async()=>{
  await regiones.loadOptions(global.optionsGroup);  
})

global.btnAddContactos.addEventListener("click",async()=>{  
  global.btnCancelModalAddContacto.classList.remove("none");
  global.btnAddNuevoContacto.classList.remove("none");
  global.btnEditarNuevoContacto.classList.add("none");
  global.btnEliminarModalAddContacto.classList.add("none");
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
  let allChecked = document.getElementsByClassName("tr-hover");
  for (let i = 0; i < allChecked.length; i++) {    
    await contacto.deleteContacto(allChecked[i].attributes.cid.value);    
  }
  window.location.reload()
});

global.btnAddContactoForm.addEventListener("click",async()=>{  
  await contacto.addContactoForm();
});
global.btnAddNuevoContacto.addEventListener("click",async()=>{  
  await global.btnAddContactoForm.click();
});
global.btnEditarNuevoContacto.addEventListener("click",async()=>{
  await contacto.editContactoForm();
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
  let token = jwt.split(".");
  let perfil = JSON.parse(atob(token[1]))
  if(perfil.perfil!=1){
    global.linkUsuarios.style.display = "none";
  }  
}
activeLink()
global.formB()
