import * as global from "./global.js";
let objeto = {
  "region": {      
  }
}
let arrayCompanias = [];
let arrayContactos = [];
let vector = []
let flag = false;
let flagCompania = true;
let contadorSeleccionadas = 0;  
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
            noLinkUsuarios()
        }
      })
    }
}
function noLinkUsuarios(){
    global.opcionesContactos.classList.remove("none");
    global.contactos.classList.remove("none");
    global.usuarios.classList.add("none");
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
    clearModalCompania()
  }
  if(e.target == global.modalAddContactos || e.target == global.btnCloseModalAddContactos || e.target == global.btnCancelModalAddContacto){
    clearModalContactos();
  }
}
window.onload = async()=>{
  await loadContactos()
  addContactos()
}
global.linkContactos.addEventListener("click",async()=>{
  global.opcionesContactos.classList.add("none");
  global.regiones.classList.add("none")
  global.usuarios.classList.add("none");
  global.companias.classList.add("none");
  global.contactos.classList.remove("none");
  if(global.bodyTablaContactos.firstElementChild){
    clearOptions(global.bodyTablaContactos)
  }
  await loadContactos();
  addContactos()
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
      clearOptions(global.bodyTablaContactos);
      addContactos()
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
        clearOptions(global.bodyTablaContactos);
        addContactos()
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
  let res = await fetch("http://localhost:3000/companias",{
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("jwt")}`
    }
  });
  arrayCompanias = await res.json()  
  addCompaniesToTable();
});
global.linkUsuarios.addEventListener("click",()=>{
  global.opcionesContactos.classList.add("none");
  global.contactos.classList.add("none");
  global.regiones.classList.add("none")    
  global.usuarios.classList.remove("none");
});
global.linkRegiones.addEventListener("click",async()=>{  
  global.opcionesContactos.classList.add("none");
  global.contactos.classList.add("none");
  global.usuarios.classList.add("none");
  global.regiones.classList.remove("none");  
  while(global.regionCiudad.firstElementChild){
    global.regionCiudad.removeChild(global.regionCiudad.firstElementChild);
    objeto = {
      "region": {      
      }
    }
  }
  await queryToJSON()
});
global.flexCheck.addEventListener("change",(e)=>{
  let checklist = document.getElementsByClassName("to-be-checked");
  if(e.currentTarget.checked){    
    for (let i = 0; i < checklist.length; i++) {            
      checklist[i].classList.add("tr-hover")
      let th = checklist[i].firstElementChild;
      let div = th.firstElementChild
      let check = div.firstElementChild
      check.checked = true      
    }
    contadorSeleccionadas = checklist.length;
    global.nroSeleccion.firstElementChild.textContent = contadorSeleccionadas + " selecciondas";    
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
  global.opCabecera.classList.toggle("none");
  global.opCabecera.classList.toggle("opciones-cabecera");
})
global.btnCrearUsuario.addEventListener("click",async()=>{
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
    global.inputNombre.value = "";
    global.inputApellido.value ="";
    global.inputEmailUsuario.value = "";
    admin = "";
    global.inputPasswordUsuario.value = "";
    if(!res.ok){
      throw "Error al registrar usuario";
    }      
    console.log("Usuario registrado con exito");    
  } catch (error) {    
    console.log("Algo salió mal: ", error);
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
        const res = await fetch("http://localhost:3000/infociudades",{
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
      deleteContacto(global.labelWarning.getAttribute("contacto"));      
      global.labelWarning.removeAttribute("contacto");
    }
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
});

function formB () {   
  var forms = document.querySelectorAll('.needs-validation')  
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
}
global.btnAceptarModalCompania.addEventListener("click",async()=>{
  try {    
    let comp = global.modalCompania.getAttribute("compania");    
    if(!comp){
      let res = await fetch("http://localhost:3000/companias",{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },
        body:JSON.stringify({
          nombre: global.inputModalCompaniaNombre.value,        
          email: global.inputModalCompaniaEmail.value,
          direccion: global.inputModalCompaniaDireccion.value,
          telefono: global.inputModalCompaniaTelefono.value,
          ciudad: global.optionsCiudad.value
        })
      });
      clearModalCompania()        
      let mensaje = await res.json()
      if(!res.ok){
        throw mensaje
      }
      console.log("Compañia agregada con exito");
      window.location.reload()
    }else{
      let res = await fetch(`http://localhost:3000/companias/${global.modalCompania.getAttribute("compania")}`,{
        method: 'PATCH',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },
        body:JSON.stringify({
          nombre: global.inputModalCompaniaNombre.value,        
          email: global.inputModalCompaniaEmail.value,
          direccion: global.inputModalCompaniaDireccion.value,
          telefono: global.inputModalCompaniaTelefono.value,
          ciudad: global.optionsCiudad.value
        })
      })
        clearModalCompania()             
        let mensaje = await res.json()      
        if(!res.ok){
          throw mensaje;
        }
        console.log("Compañia actualizada");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
})

global.btnAddCompanias.addEventListener("click",async()=>{
  await loadOptions(global.optionsGroup);  
})

global.btnAddContactos.addEventListener("click",async()=>{  
  global.btnCancelModalAddContacto.classList.remove("none");
  global.btnAddNuevoContacto.classList.remove("none");
  global.btnEditarNuevoContacto.classList.add("none");
  global.btnEliminarModalAddContacto.classList.add("none");
  await loadCompaniaToModal();
  await loadOptions(global.optionsGroupContactos);
  await loadCanales(global.selectCanal);  
})

global.agregarCanal.addEventListener("click",async()=>{
  if(global.selectCanal.value!="" && global.inputCuentaContacto.value != "" && global.selectPreferencia.value != ""){
    await addCanalToModal(global.selectCanal.value,global.inputCuentaContacto.value,global.selectPreferencia.value,false);
    global.selectCanal.value = ""
    global.inputCuentaContacto.value = ""
    global.selectPreferencia.value = ""
  }
})

global.linkEliminar.addEventListener("click", async()=>{
  let allChecked = document.getElementsByClassName("tr-hover");
  for (let i = 0; i < allChecked.length; i++) {    
    await deleteContacto(allChecked[i].attributes.cid.value);    
  }
  window.location.reload()
});

global.btnAddContactoForm.addEventListener("click",async()=>{
  try {    
    if(global.inputModalContactoNombre.value != "" && global.inputModalContactoApellido.value != "" && global.inputModalContactoCargo.value != "" && global.inputModalContactEmail.value != "" && global.selectCompanias.value != "" && global.selectCiudadContactos.value != "" && global.selectInteres.value != "" && global.inputModalContactoDireccion.value != ""){
      if(global.selectCanal.value != "" && (global.inputCuentaContacto.value == "" || global.selectPreferencia.value == "")){
        console.log("Faltan parámetros");
        return;
      }
      let res = await fetch("http://localhost:3000/contactos",{
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
            nombre: global.inputModalContactoNombre.value,
            apellido: global.inputModalContactoApellido.value, 
            cargo: global.inputModalContactoCargo.value,         
            email: global.inputModalContactEmail.value,
            compania: global.selectCompanias.value,
            ciudad: global.selectCiudadContactos.value,
            interes: global.selectInteres.value,
            direccion: global.inputModalContactoDireccion.value          
        })
      });
      if(res.ok){
        let resAsJSON = await res.json()      
        if(global.masCanales.childElementCount != 0){
          await addCanales(resAsJSON[0]);
        }
      }
      clearModalContactos();      
      window.location.reload()
    }
  } catch (error) {
    console.log(error);
  }
});
global.btnAddNuevoContacto.addEventListener("click",async()=>{  
  await global.btnAddContactoForm.click();
})
global.btnEditarNuevoContacto.addEventListener("click",async()=>{
  try {
    if(global.inputModalContactoNombre.value != "" && global.inputModalContactoApellido.value != "" && global.inputModalContactoCargo.value != "" && global.inputModalContactEmail.value != "" && global.selectCompanias.value != "" && global.selectCiudadContactos.value != "" && global.selectInteres.value != "" && global.inputModalContactoDireccion.value != ""){
      let idContacto = global.modalAddContactos.getAttribute("id_c")
      let res = await fetch(`http://localhost:3000/contactos/${idContacto}`,{
        method: "PATCH",
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
            nombre: global.inputModalContactoNombre.value,
            apellido: global.inputModalContactoApellido.value, 
            cargo: global.inputModalContactoCargo.value,         
            email: global.inputModalContactEmail.value,
            compania: global.selectCompanias.value,
            ciudad: global.selectCiudadContactos.value,
            interes: global.selectInteres.value,
            direccion: global.inputModalContactoDireccion.value          
        })
      });          
      let contador = global.modalAddContactos.getAttribute("cuentas");    
      let children = global.masCanales.childElementCount;
      if(children != 0 && contador == 0){      
        await addCanales(idContacto);
      }else{
      await editCanales(idContacto,contador);
      }
      if(!res.ok){
        throw 'Error al actualizar datos';
      }      
      window.location.reload()  
    }        
  } catch (error) {
    console.log(error);
  }
  
})

async function queryToJSON(){
  try {
    let consulta = await fetch("http://localhost:3000/infociudades");
    let consultaAsJson = await consulta.json()
    vector = consultaAsJson;        
    vector.forEach((obj)=>{
      let prop = obj.region
      let ciudades = []      
      if(prop in objeto.region){
        if(prop != "id"){
          let pais = obj.pais;
          if(pais in objeto.region[prop]){                      
            objeto.region[prop][pais].ciudades.push({"id": obj.id_ciudad, "ciudad": obj.ciudad})             
          }else{
            ciudades = []
            objeto.region[prop][pais] = {
              "id": obj.id_pais,
              "ciudades": ciudades
            }                    
            objeto.region[prop][pais].ciudades.push({"id": obj.id_ciudad, "ciudad": obj.ciudad}       )          
          }
        }
      }else{        
        let pais = obj.pais;              
        let id_region = "id"
        objeto.region[prop] = {}
        objeto.region[prop][id_region] = obj.id_region;
        objeto.region[prop][pais] = {
          "id": obj.id_pais,
          "ciudades": ciudades
        }                    
        objeto.region[prop][pais].ciudades.push({"id": obj.id_ciudad, "ciudad": obj.ciudad})          
      }
    })                    
    addContentToTree(objeto.region)
  } catch (error) {
    console.log(error);
  }
}

function addContentToTree(obj){  
  for (let region in obj) {    
    
    let divCardRegion = document.createElement("div");
    divCardRegion.setAttribute("class", "card region");
    let divCardBody = document.createElement("div");
    divCardBody.setAttribute("class", "card-body");
    
    let divRegionBody = document.createElement("div");
    divRegionBody.setAttribute("class", "region-body");
    let h5 = document.createElement("h5");
    h5.setAttribute("class","card-title")
    h5.textContent = region
    
    let button = document.createElement("i");
    button.setAttribute("class", "fas fa-plus-circle fa-lg");
    let buttonEdit = document.createElement("i");
    buttonEdit.setAttribute("class", "fas fa-edit fa-lg");
    let buttonDelete = document.createElement("i");
    buttonDelete.setAttribute("class","fas fa-minus-circle fa-lg");

    button.setAttribute("data-bs-target", "#exampleModal")
    button.setAttribute("data-bs-toggle", "modal")
    button.addEventListener("click",()=>{            
      global.modalLabel.textContent = "Añadir pais";      
      global.labelAddInModal.setAttribute("region",obj[region].id);
      global.labelAddInModal.textContent = "Escriba el nombre del pais a agregar"
    })

    buttonEdit.setAttribute("data-bs-target", "#exampleModal")
    buttonEdit.setAttribute("data-bs-toggle", "modal");
    buttonEdit.addEventListener("click",()=>{            
      global.modalLabel.textContent = "Editar región";            
      global.labelAddInModal.setAttribute("eregion",obj[region].id);
      global.inputModal.value = region
    });

    buttonDelete.setAttribute("data-bs-target", "#warningModal");
    buttonDelete.setAttribute("data-bs-toggle","modal");
    buttonDelete.addEventListener("click",()=>{
      global.labelWarning.textContent = `Está seguro que desea eliminar '${region}'?`
      global.labelWarning.setAttribute("region",obj[region].id);
    })

    let spanBtn = document.createElement("span");
    spanBtn.setAttribute("class", "link-success");
    spanBtn.appendChild(button);

    let spanEdit = document.createElement("span");
    spanEdit.setAttribute("class", "link-primary");
    spanEdit.appendChild(buttonEdit);

    let spanDelete = document.createElement("span");
    spanDelete.setAttribute("class","link-danger");
    spanDelete.appendChild(buttonDelete);

    let divOpciones = document.createElement("div");
    divOpciones.setAttribute("class","div-opciones-flex");
    divOpciones.appendChild(spanBtn);
    divOpciones.appendChild(spanEdit);
    divOpciones.appendChild(spanDelete);

    divRegionBody.appendChild(h5);
    divRegionBody.appendChild(divOpciones);
    
    
    divCardBody.appendChild(divRegionBody);    
    let divTreeList = document.createElement("div");
    divTreeList.setAttribute("class","list-tree");   
    
    let ul = document.createElement("ul");        
    for(pais in obj[region]){          
      if(pais != "null" && pais != "id"){        
        let li = document.createElement("li");
        let spanCaret = document.createElement("span");
        spanCaret.setAttribute("class","caret")
        spanCaret.textContent = pais;
        let spanOpciones =document.createElement("span");
        spanOpciones.setAttribute("class","opciones");
        spanOpciones.setAttribute("pais", pais);
        spanOpciones.setAttribute("id_pais", obj[region][pais].id);

        let spanSuccess = document.createElement("span");
        spanSuccess.setAttribute("class", "link-success");
        let iconPlus = document.createElement("i");
        iconPlus.setAttribute("class","fas fa-plus-circle");        
        spanSuccess.setAttribute("data-bs-target", "#exampleModal")
        spanSuccess.setAttribute("data-bs-toggle", "modal");
        spanSuccess.addEventListener("click",()=>{                  
          global.modalLabel.textContent = "Añadir ciudad";          
          global.labelAddInModal.textContent = `Escriba el nombre de la ciudad a agregar en ${spanOpciones.getAttribute("pais")}.`          
          global.labelAddInModal.setAttribute("pais", spanOpciones.getAttribute("id_pais"));
        })
        spanSuccess.appendChild(iconPlus);

        let spanLinkPrimary = document.createElement("span");
        spanLinkPrimary.setAttribute("class", "link-primary")        
        spanLinkPrimary.setAttribute("data-bs-target", "#exampleModal");
        spanLinkPrimary.setAttribute("data-bs-toggle","modal");
        spanLinkPrimary.addEventListener("click",()=>{
          global.modalLabel.textContent = "Editar pais";
          global.labelAddInModal.textContent = ""
          global.inputModal.value = spanOpciones.getAttribute("pais");
          global.labelAddInModal.setAttribute("epais", spanOpciones.getAttribute("id_pais"));
        })
        let iconEdit = document.createElement("i")
        iconEdit.setAttribute("class", "far fa-edit");
        
        spanLinkPrimary.appendChild(iconEdit);

        let spanLinkDanger = document.createElement("span");
        spanLinkDanger.setAttribute("class", "link-danger")
        let iconDelete = document.createElement("i")        
        iconDelete.setAttribute("class", "far fa-trash-alt");
        spanLinkDanger.appendChild(iconDelete);
        spanLinkDanger.setAttribute("data-bs-target", "#warningModal");
        spanLinkDanger.setAttribute("data-bs-toggle","modal");
        spanLinkDanger.addEventListener("click",()=>{
          global.labelWarning.textContent = `Está seguro que desea eliminar '${spanOpciones.getAttribute("pais")}'?`
          global.labelWarning.setAttribute("pais",spanOpciones.getAttribute("id_pais"));
        })
        
        spanOpciones.appendChild(spanSuccess);
        spanOpciones.appendChild(spanLinkPrimary);
        spanOpciones.appendChild(spanLinkDanger);
  
        let ulNested = document.createElement("ul");
        ulNested.setAttribute("class","nested");      
        let arrayActual = obj[region][pais].ciudades
        for (let i = 0; i < arrayActual.length; i++) {            
          if(arrayActual[i].ciudad!=null){
            let liCiudades = document.createElement("li");
            liCiudades.setAttribute("class", "li-ciudades");
            let spanNombre = document.createElement("span");
            spanNombre.textContent = arrayActual[i].ciudad
            let spanOpciones =document.createElement("span");
            spanOpciones.setAttribute("class","opciones");
            spanOpciones.setAttribute("ciudad", arrayActual[i].ciudad);
            spanOpciones.setAttribute("id_ciudad", arrayActual[i].id);

            let spanLinkPrimary = document.createElement("span");
            spanLinkPrimary.setAttribute("class", "link-primary")               
            spanLinkPrimary.setAttribute("data-bs-target", "#exampleModal");
            spanLinkPrimary.setAttribute("data-bs-toggle","modal");
            spanLinkPrimary.addEventListener("click",()=>{
              modalLabel.textContent = "Editar ciudad";
              labelAddInModal.textContent = ""
              inputModal.value = spanOpciones.getAttribute("ciudad");
              labelAddInModal.setAttribute("eciudad", spanOpciones.getAttribute("id_ciudad"));
            })            

            let iconEdit = document.createElement("i")
            iconEdit.setAttribute("class", "far fa-edit")
            spanLinkPrimary.appendChild(iconEdit);

            let spanLinkDanger = document.createElement("span");
            spanLinkDanger.setAttribute("class", "link-danger")
            spanLinkDanger.setAttribute("data-bs-target", "#warningModal");
            spanLinkDanger.setAttribute("data-bs-toggle","modal");
            spanLinkDanger.addEventListener("click",()=>{
              global.labelWarning.textContent = `Está seguro que desea eliminar '${spanOpciones.getAttribute("ciudad")}'?`
              global.labelWarning.setAttribute("ciudad",spanOpciones.getAttribute("id_ciudad"));
            })
            let iconDelete = document.createElement("i")        
            iconDelete.setAttribute("class", "far fa-trash-alt");
            spanLinkDanger.appendChild(iconDelete);
    
            spanOpciones.appendChild(spanLinkPrimary);
            spanOpciones.appendChild(spanLinkDanger);
    
            liCiudades.appendChild(spanNombre);
            liCiudades.appendChild(spanOpciones);
            ulNested.appendChild(liCiudades);        
          }
        }        
        li.appendChild(spanCaret);
        li.appendChild(spanOpciones);
        li.appendChild(ulNested);
        
        ul.appendChild(li)
      }
    }
    divTreeList.appendChild(ul)
    divCardBody.appendChild(divTreeList)   

    divCardRegion.appendChild(divCardBody);
    global.regionCiudad.appendChild(divCardRegion);    
  }
}

function addCompaniesToTable(){
  for (let i = 0; i < arrayCompanias.length; i++) {    
    let tr = document.createElement("tr");
    let tdNombre = document.createElement("td");
    tdNombre.textContent = arrayCompanias[i].compania;
    let tdEmail = document.createElement("td");
    tdEmail.textContent = arrayCompanias[i].email;
    let tdUbicacion = document.createElement("td");
    tdUbicacion.textContent = arrayCompanias[i].ciudad + " - " + arrayCompanias[i].pais;
    let tdTelefono =  document.createElement("td");
    tdTelefono.textContent = arrayCompanias[i].telefono;
    let tdDireccion = document.createElement("td");
    tdDireccion.textContent = arrayCompanias[i].direccion;
    let tdOpciones = document.createElement("td");
    let divOpciones = document.createElement("div");
    divOpciones.setAttribute("class", "div-opciones-companias");
    let spanPrimary = document.createElement("span");
    spanPrimary.setAttribute("class","link-primary");
    let iEdit = document.createElement("i");
    iEdit.setAttribute("class", "far fa-edit");    
    iEdit.setAttribute("data-bs-toggle","modal")
    iEdit.setAttribute("data-bs-target","#modalCompania")
    iEdit.addEventListener("click",async()=>{
      global.inputModalCompaniaNombre.value = arrayCompanias[i].compania;
      global.inputModalCompaniaEmail.value = arrayCompanias[i].email;
      global.inputModalCompaniaDireccion.value = arrayCompanias[i].direccion;
      global.inputModalCompaniaTelefono.value = arrayCompanias[i].telefono;
      global.modalCompania.setAttribute("compania", arrayCompanias[i].id_compania);
      await loadOptions(global.optionsGroup);
      global.optionsGroup.value = arrayCompanias[i].id_region;      
      await loadPaises(global.optionsPais,global.optionsGroup);      
      global.optionsPais.value = arrayCompanias[i].id_pais;
      await loadCiudades(global.optionsCiudad, global.optionsPais);
      global.optionsCiudad.value = arrayCompanias[i].id_ciudad;      
      flagCompania = false
    });
    spanPrimary.appendChild(iEdit);
    let spanDelete = document.createElement("span");
    spanDelete.setAttribute("class","link-danger");
    let iDelete = document.createElement("i");
    iDelete.setAttribute("class","fas fa-times-circle");
    iDelete.setAttribute("data-bs-target", "#warningModal");
    iDelete.setAttribute("data-bs-toggle","modal");
    iDelete.addEventListener("click",()=>{
      global.labelWarning.textContent = `Está seguro que desea eliminar '${arrayCompanias[i].compania}'?`
      global.labelWarning.setAttribute("compania",arrayCompanias[i].id_compania);
    })    
    spanDelete.appendChild(iDelete);
    divOpciones.appendChild(spanPrimary)
    divOpciones.appendChild(spanDelete)
    tdOpciones.appendChild(divOpciones);    

    tr.appendChild(tdNombre);
    tr.appendChild(tdEmail)
    tr.appendChild(tdUbicacion);
    tr.appendChild(tdTelefono);
    tr.appendChild(tdDireccion);
    tr.appendChild(tdOpciones);
    global.bodyTabla.appendChild(tr)
  }
}

async function loadContactos(){
  try {
    let res = await fetch("http://localhost:3000/contactos",{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },      
    });
    arrayContactos = await res.json()    
  } catch (error) {
    console.log(error);
  }  
}
async function loadCanales(select){
  try {
    let res = await fetch("http://localhost:3000/canales",{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
    });    
    let canales = await res.json();    
    clearOptions(select);        
    let emptyOption = document.createElement("option");
    emptyOption.setAttribute("selected","");
    select.appendChild(emptyOption);
    for (let i = 0; i < canales.length; i++) {      
      let option = document.createElement("option");            
      option.textContent = canales[i].nombre        
      option.setAttribute("value",canales[i].id);
      select.appendChild(option);      
    }    
  } catch (error) {
    console.log(error);
  }
}
function check(e){  
  e.preventDefault()
  
}
async function loadPreferencias(selectP){
  try {
    let res = await fetch("http://localhost:3000/preferencias",{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
    });
    if(selectP=== selectPreferencia){
      global.selectPreferencia.disabled = false;
      global.inputCuentaContacto.disabled = false
    }
    let preferencias = await res.json()
    clearOptions(selectP);        
    let emptyOption = document.createElement("option");
    emptyOption.setAttribute("selected","");
    selectP.appendChild(emptyOption);
    for (let i = 0; i < preferencias.length; i++) {      
      let option = document.createElement("option");            
      option.textContent = preferencias[i].nombre        
      option.setAttribute("value",preferencias[i].id);
      selectP.appendChild(option);      
    }
  } catch (error) {
    console.log(error);
  }
}
async function loadOptions(options){
  try {
    let res = await fetch("http://localhost:3000/regiones",{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
    });
    let regiones = await res.json();        
    clearOptions(options);        
    let emptyOption = document.createElement("option");
    emptyOption.setAttribute("selected","");
    options.appendChild(emptyOption);
    for (let i = 0; i < regiones.length; i++) {      
      let option = document.createElement("option");            
      option.textContent = regiones[i].nombre        
      option.setAttribute("value",regiones[i].id);
      options.appendChild(option);      
    }    
  } catch (error) {
    console.log(error);
  }
}
async function loadPaises(options, previewsOptions){  
  try {
    let res = await fetch("http://localhost:3000/paises");
    let arrayPaises = await res.json();      
    clearOptions(options);
    if(global.optionsCiudad.length > 1){    
      clearOptions(global.optionsCiudad);
    }
    if(global.selectCiudadContactos.length>1){
      clearOptions(global.selectCiudadContactos);
    }
    if(global.selectPaisContactos === options){      
      global.selectPaisContactos.disabled = false;
    }
    let emptyOption = document.createElement("option");
    emptyOption.setAttribute("selected","");
    options.appendChild(emptyOption);
    for (let i = 0; i < arrayPaises.length; i++) {      
      let option = document.createElement("option");         
      if(arrayPaises[i].region == previewsOptions.value){
        option.textContent = arrayPaises[i].nombre  
        option.setAttribute("value",arrayPaises[i].id);      
        options.appendChild(option);    
      }
    }     
  } catch (error) {
    console.log(error);
  }
}
async function loadCiudades(options,previewsOptions){  
  try {
    let res = await fetch("http://localhost:3000/ciudades");
    let arrayCiudades = await res.json();  
    clearOptions(options);
    if(global.selectCiudadContactos === options){      
      global.selectCiudadContactos.disabled = false;
    }
    let emptyOption = document.createElement("option");
    emptyOption.setAttribute("selected","");
    options.appendChild(emptyOption);
    for (let i = 0; i < arrayCiudades.length; i++) {      
      let option = document.createElement("option");         
      if(arrayCiudades[i].pais == previewsOptions.value){
        option.textContent = arrayCiudades[i].nombre        
        option.setAttribute("value",arrayCiudades[i].id)
        options.appendChild(option);    
      }
    }      
  } catch (error) {
    console.log(error);
  }
}
async function deleteContacto(id){
  try {
    let res = await fetch(`http://localhost:3000/contactos/${id}`,{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },      
    });
    if(!res.ok){
      throw 'Error al eliminar los datos';
    }    
  } catch (error) {
    console.log(error);
  }
}
function clearOptions(options){
  while(options.firstElementChild){
    options.removeChild(options.firstElementChild);
  }
}
function clearModalCompania(){
  global.inputModalCompaniaNombre.value = "";
  global.inputModalCompaniaDireccion.value = "";
  global.inputModalCompaniaEmail.value = "";
  global.inputModalCompaniaTelefono.value = "";
  global.modalCompania.removeAttribute("compania");  
  clearOptions(global.optionsPais);  
  clearOptions(global.optionsCiudad);
}

function addContactos(){    
  for (let i = 0; i < arrayContactos.length; i++) {    
    let tr = document.createElement("tr");
    tr.setAttribute("cid",arrayContactos[i].id)
    let th = document.createElement("th");
    th.setAttribute("scope","row");
    let divCheck = document.createElement("div")
    divCheck.setAttribute("class","form-check");
    let inputDiv = document.createElement("input");
    inputDiv.setAttribute("class","form-check-input")
    inputDiv.setAttribute("type","checkbox");
    tr.setAttribute("class","to-be-checked");
    inputDiv.addEventListener("change",(e)=>{
      let sp = global.nroSeleccion.firstElementChild;
      if(e.currentTarget.checked){
        tr.classList.add("tr-hover")
        contadorSeleccionadas++;
        sp.textContent = contadorSeleccionadas + " seleccionadas";
        global.opCabecera.classList.remove("none");
        global.opCabecera.classList.add("opciones-cabecera");
      }else{
        tr.classList.remove("tr-hover")
        contadorSeleccionadas = contadorSeleccionadas -1;         
        sp.textContent = contadorSeleccionadas + " selecciondas";
        if(contadorSeleccionadas==0){
          global.opCabecera.classList.remove("opciones-cabecera");
          global.opCabecera.classList.add("none");
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
    let divInfoContact = document.createElement("div");
    divInfoContact.setAttribute("class","info-contact");
    let spanContacto = document.createElement("span");
    spanContacto.textContent = arrayContactos[i].nombre;
    let spanContactoEmail = document.createElement("span");
    spanContactoEmail.textContent = arrayContactos[i].email;
    divInfoContact.appendChild(spanContacto);
    divInfoContact.appendChild(spanContactoEmail);
    td.appendChild(divInfoContact);
    tr.appendChild(td)

    let tdPais = document.createElement("td");
    let divPais = document.createElement("div");
    divPais.setAttribute("class","info-contact");
    let spanPais = document.createElement("span");
    spanPais.textContent = arrayContactos[i].pais;
    let spanRegion = document.createElement("span");
    spanRegion.textContent = arrayContactos[i].region;
    divPais.appendChild(spanPais);
    divPais.appendChild(spanRegion);
    tdPais.appendChild(divPais);
    tr.appendChild(tdPais);

    let tdCompania = document.createElement("td");
    tdCompania.textContent = arrayContactos[i].compania
    tr.appendChild(tdCompania);

    let tdCargo = document.createElement("td");
    tdCargo.textContent = arrayContactos[i].cargo;
    tr.appendChild(tdCargo);

    let tdInteres =document.createElement("td");
    tdInteres.setAttribute("colspan", "4");
    let divProgresoGroup = document.createElement("div");
    divProgresoGroup.setAttribute("class","progress-group");    
    let spanProgreso = document.createElement("span");    
    let divProgress = document.createElement("div");
    divProgress.setAttribute("class","progress");
    let divBar = document.createElement("div");
    divBar.setAttribute("class","progress-bar");    
    divBar.setAttribute("role", "progressbar");   
    let porcentaje = arrayContactos[i].porcentaje;
    spanProgreso.textContent = porcentaje + "%";
    switch (porcentaje) {
      case 100:
        divBar.classList.add("bg-danger");
        divBar.setAttribute("style","width: 100%");
        break;
      case 75:
        divBar.classList.add("bg-orange");
        divBar.setAttribute("style","width: 75%");
        break;
      case 50:
        divBar.classList.add("bg-warning");
        divBar.setAttribute("style","width: 50%");
        break;
      case 25:
        divBar.classList.add("bg-info");
        divBar.setAttribute("style","width: 25%");
        break;
      default:        
        break;  
    }
    divProgress.appendChild(divBar);
    divProgresoGroup.appendChild(spanProgreso);
    divProgresoGroup.appendChild(divProgress);  
    tdInteres.appendChild(divProgresoGroup);
    tr.appendChild(tdInteres);

    let tdAcciones = document.createElement("td");
    let divOpciones = document.createElement("div");
    divOpciones.setAttribute("class", "div-opciones-contactos");
    let spanLinkPrimary = document.createElement("span");
    spanLinkPrimary.setAttribute("class","link-primary")
    let iconEdit = document.createElement("i");
    iconEdit.setAttribute("class","far");
    iconEdit.classList.add("fa-edit");
    iconEdit.setAttribute("data-bs-toggle","modal")
    iconEdit.setAttribute("data-bs-target","#modalAddContactos")
    iconEdit.addEventListener("click",async()=>{
      global.btnCancelModalAddContacto.classList.add("none");
      global.btnAddNuevoContacto.classList.add("none");
      global.btnEditarNuevoContacto.classList.remove("none");
      global.btnEliminarModalAddContacto.classList.remove("none");
      global.modalAddContactos.setAttribute("id_c", arrayContactos[i].id);
      global.inputModalContactoNombre.value = arrayContactos[i].nombre
      global.inputModalContactoApellido.value = arrayContactos[i].apellido
      global.inputModalContactoCargo.value = arrayContactos[i].cargo
      global.inputModalContactEmail.value = arrayContactos[i].email
      global.inputModalContactoDireccion.value = arrayContactos[i].direccion
      global.inputModalContactoDireccion.disabled = false;
      await loadCompaniaToModal()
      global.selectCompanias.value = arrayContactos[i].id_compania;
      await loadOptions(global.optionsGroupContactos);
      global.optionsGroupContactos.value = arrayContactos[i].id_region      
      await loadPaises(global.selectPaisContactos,global.optionsGroupContactos);
      global.selectPaisContactos.value = arrayContactos[i].id_pais
      await loadCiudades(global.selectCiudadContactos,global.selectPaisContactos);
      global.selectCiudadContactos.value = arrayContactos[i].id_ciudad;
      await loadCanales(global.selectCanal);  
      switch (porcentaje) {
        case 100:
          global.selectInteres.value = 5
          break;
        case 75:
          global.selectInteres.value = 4
          break;
        case 50:
          global.selectInteres.value = 3
          break;
        case 25:
          global.selectInteres.value = 2
          break;
        default:
          global.selectInteres.value = 1                  
          break;  
      }
      let res = await fetch(`http://localhost:3000/canalesporcontactos?contacto=${arrayContactos[i].id}`,{
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        }
      });
      if(!res.ok){
        throw 'Error al consultar los registros de la base de datos';
      }
      let cuentas = await res.json();      
      global.modalAddContactos.setAttribute("cuentas", cuentas.length);      
      for (let i = 0; i < cuentas.length; i++) {
        await addCanalToModal(cuentas[i].canal,cuentas[i].cuenta,cuentas[i].preferencia,true,cuentas[i].id_canal,cuentas[i].id_preferencia, cuentas[i].id);              
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
      global.labelWarning.textContent = `Está seguro que desea eliminar este contacto?`
      global.labelWarning.setAttribute("contacto",arrayContactos[i].id);  
    })
    spanLinkDanger.appendChild(iconDelete);
    divOpciones.appendChild(spanLinkPrimary);
    divOpciones.appendChild(spanLinkDanger);
    tdAcciones.appendChild(divOpciones);
    tr.appendChild(tdAcciones);

    global.bodyTablaContactos.appendChild(tr);    
  }
}
async function addCanalToModal(selectCanalValue,inputCuentaContactoValue, selectPreferenciaValue, edicion, pos1=0,pos2=0, id_reg=0){  

    let selectC = document.createElement("select");      
    selectC.setAttribute("class","form-select");
    selectC.setAttribute("required","")
    selectC.setAttribute("disabled","");

    await loadCanales(selectC);
    if(pos1!=0){
      selectC.value = pos1
    }else{
      selectC.value = selectCanalValue    
    }
    
    let inputCC = document.createElement("input");
    inputCC.setAttribute("type","text");
    inputCC.setAttribute("class","form-control");
    inputCC.setAttribute("required","");
    inputCC.setAttribute("disabled","");
    inputCC.value = inputCuentaContactoValue
  
    let select = document.createElement("select");      
    select.setAttribute("class","form-select");
    select.setAttribute("required","")
    select.setAttribute("disabled","");
    
    await loadPreferencias(select);
    if(pos2!=0){
      select.value = pos2;
    }else{
      select.value = selectPreferenciaValue;
    }        
    let spanPrimary = document.createElement("span");
    let iconEdit = document.createElement("i");
    let spanEditar = document.createElement("span");
    spanEditar.textContent = "Editar canal"
    iconEdit.setAttribute("class","fas");
    iconEdit.classList.add("fa-pen")
    spanPrimary.setAttribute("class","btn");
    spanPrimary.classList.add("btn-outline-primary");
    spanPrimary.appendChild(iconEdit);
    spanPrimary.appendChild(spanEditar);
    if(id_reg!=0){
     spanPrimary.setAttribute("id_reg",id_reg); 
    }    
    spanPrimary.addEventListener("click",()=>{
      selectC.disabled = false;
      inputCC.disabled = false;
      select.disabled = false;
    })

    let spanDelete = document.createElement("span");
    let iconDelete = document.createElement("i");
    let spanEliminar = document.createElement("span");
    spanEliminar.textContent = "Eliminar canal";
    iconDelete.setAttribute("class","fas");
    iconDelete.classList.add("fa-trash-alt");
    spanDelete.setAttribute("class","btn");
    spanDelete.classList.add("btn-outline-secondary");
    spanDelete.appendChild(iconDelete);
    spanDelete.appendChild(spanEliminar);        

    spanDelete.addEventListener("click",async()=>{
      global.masCanales.removeChild(selectC)
      global.masCanales.removeChild(inputCC)
      global.masCanales.removeChild(select)
      global.masCanales.removeChild(spanPrimary)
      global.masCanales.removeChild(spanDelete)
      if(edicion){
        let res = await fetch(`http://localhost:3000/canalesporcontactos/${id_reg}`,{
          method: 'DELETE',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },
        })
        if(!res.ok){
          throw 'Error al eliminar el registro';
        }
      }
    })    
    global.masCanales.appendChild(selectC);
    global.masCanales.appendChild(inputCC);
    global.masCanales.appendChild(select);
    if(edicion){
      global.masCanales.appendChild(spanPrimary);
    }
    global.masCanales.appendChild(spanDelete);  
}
async function loadCompaniaToModal(){
  try {
    let res = await fetch("http://localhost:3000/companias",{
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      }
    });
    clearOptions(global.selectCompanias);
    arrayCompanias = await res.json();  
    let emptyOption = document.createElement("option");
    emptyOption.setAttribute("selected","");
    global.selectCompanias.appendChild(emptyOption);
    for (let i = 0; i < arrayCompanias.length; i++) {      
      let option = document.createElement("option");            
      option.textContent = arrayCompanias[i].compania        
      option.setAttribute("value",arrayCompanias[i].id_compania);
      global.selectCompanias.appendChild(option);      
    }      
  } catch (error) {
    console.log(error);    
  }
}
async function addCanales(contacto,i=0){
  let iCanal ="";
  let iCuenta="";
  let iPreferencia ="";
  for (i; i < masCanales.childElementCount; i++) {
    let children = masCanales.children[i]
    if(!children.classList.contains("btn")){            
      if(i%5 == 0){
        iCanal = children.value
      }else if(i%5==1){
        iCuenta = children.value
      }else if(i%5==2){
        iPreferencia = children.value
      }
    }else{
      if(i%5 ==3){         
        let res = await fetch("http://localhost:3000/canalesporcontactos",{
          method: "POST",
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },
          body: JSON.stringify({
              contacto: contacto,
              canal: iCanal,
              preferencia: iPreferencia,
              cuenta: iCuenta
          })
        });
        let mensaje = await res.json()
        if(!res.ok){
          throw mensaje;
        }
      }
    }
  }
}
async function editCanales(contacto,cont){
  let iCanal ="";
  let iCuenta="";
  let iPreferencia ="";
  let i = 0;
  let count = global.masCanales.childElementCount
  for (i; i < count; i++) {
    let children = global.masCanales.children[i]
    if(!children.classList.contains("btn")){            
      if(i%5 == 0){
        iCanal = children.value
      }else if(i%5==1){
        iCuenta = children.value
      }else if(i%5==2){
        iPreferencia = children.value
      }
    }else{
      if(i%5 ==3 && cont!=0){         
        let res = await fetch(`http://localhost:3000/canalesporcontactos/${children.getAttribute("id_reg")}`,{
          method: "PATCH",
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },
          body: JSON.stringify({              
              canal: iCanal,
              preferencia: iPreferencia,
              cuenta: iCuenta
          })
        });
        let mensaje = await res.json()
        if(!res.ok){
          throw mensaje;
        }
        cont--
      }      
      if(cont==0){
        break;
      }
    }
  }
  console.log(i);
  if(i+1!=count-1){
    await addCanales(contacto,i)
  }
}
function clearModalContactos(){
  global.inputModalContactoNombre.value = "";
  global.inputModalContactoApellido.value = "";
  global.inputModalContactoCargo.value = "";
  global.inputModalContactEmail.value = "";
  clearOptions(global.selectPaisContactos);
  global.selectPaisContactos.setAttribute("disabled","");
  clearOptions(global.selectCiudadContactos);
  global.selectCiudadContactos.setAttribute("disabled","");
  global.inputModalContactoDireccion.value = "";
  global.inputModalContactoDireccion.setAttribute("disabled","");  
  global.inputCuentaContacto.value = ""
  global.inputCuentaContacto.setAttribute("disabled","");
  global.selectPreferencia.setAttribute("disabled","");
  global.selectInteres.value = 1
  clearOptions(global.masCanales)  
}
activeLink()
formB()
