let linkContactos = document.getElementsByClassName("links")[0];
let linkCompanias = document.getElementsByClassName("links")[1];
let linkUsuarios = document.getElementsByClassName("links")[2];
let linkRegiones = document.getElementsByClassName("links")[3];
let opcionesContactos = document.getElementById("opciones-contactos");
let companias = document.getElementById("companias");
let contactos = document.getElementById("contactos");
let usuarios = document.getElementById("usuarios");
let btnCrearUsuario = document.getElementById("btn-crear-usuario");
let inputNombre = document.getElementById("inputNombre");
let inputApellido = document.getElementById("inputApellido");
let inputEmailUsuario = document.getElementById("inputEmailUsuario");
let perfil = document.getElementById("perfil");
let inputPasswordUsuario = document.getElementById("inputPasswordUsuario");
let regionCiudad = document.getElementById("region-ciudad");
let regiones = document.getElementById("regiones")
let modalLabel = document.getElementById("addModalLabel");
let btnAceptarModal = document.getElementById("btnAceptarModal");
let btnEliminar = document.getElementById("btnAceptarWarningModal");
let labelAddInModal = document.getElementById("labelInfoAdd");
let labelWarning = document.getElementById("labelWarning");
let inputModal = document.getElementById("inputModal");
let btnAgregarRegion = document.getElementById("btnAgregarRegion");
let vector = []
let flag = false;
let btnClose = document.getElementById("close");
let xClose =document.getElementById("xclose");
let modal = document.getElementById("exampleModal");
let modalCompania = document.getElementById("modalCompania")
let xCloseCompania = document.getElementById("xcloseCompania");
let btnCloseCompania = document.getElementById("btnCloseModalCompania")
let bodyTabla = document.getElementById("tbody");
let bodyTablaContactos = document.getElementById("tbodyContactos");
let btnAddCompanias = document.getElementById("addCompanias");
let inputModalCompaniaNombre = document.getElementById("inputModalCompaniaNombre")
let inputModalCompaniaDireccion = document.getElementById("inputModalCompaniaDireccion")
let inputModalCompaniaEmail = document.getElementById("inputModalCompaniaEmail")
let inputModalCompaniaTelefono = document.getElementById("inputModalCompaniaTelefono")
let optionsGroup = document.getElementById("optionsGroup");    
let optionsCiudad = document.getElementById("optionsCiudad");  
let optionsPais = document.getElementById("optionsPais");  
let flexCheck = document.getElementById("flexCheck");
let divSearch = document.getElementById("div-icon-search");
let inputSearch = document.getElementById("inputSearch");
let objeto = {
  "region": {      
  }
}
let arrayCompanias = [];
let arrayContactos = [];
let flagCompania = true;
let btnAceptarModalCompania = document.getElementById("btnAceptarModalCompania");
let contadorSeleccionadas = 0;
let nroSeleccion = document.getElementById("nro-seleccion");
let opCabecera = contactos.firstElementChild
let linkEliminar = document.getElementById("eliminar-contacto")

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
    opcionesContactos.classList.remove("none");
    contactos.classList.remove("none");
    usuarios.classList.add("none");
}
window.onclick = function(e){  
  if(e.target == modal || e.target == btnClose || e.target == xClose){    
    modalLabel.textContent = "";
    labelAddInModal.textContent = "";
    inputModal.value = ""    
    labelAddInModal.removeAttribute("region");
    labelAddInModal.removeAttribute("pais");
    labelAddInModal.removeAttribute("epais");
    labelAddInModal.removeAttribute("eciudad");
  }
  if(e.target == modalCompania || e.target == btnCloseCompania || e.target == xCloseCompania){
    clearModalCompania()
  }
}
window.onload = async()=>{
  await loadContactos()
  addContactos()
}
linkContactos.addEventListener("click",async()=>{
  opcionesContactos.classList.add("none");
  regiones.classList.add("none")
  usuarios.classList.add("none");
  companias.classList.add("none");
  contactos.classList.remove("none");
  if(bodyTablaContactos.firstElementChild){
    clearOptions(bodyTablaContactos)
  }
  await loadContactos();
  addContactos()
});
divSearch.addEventListener("click",async()=>{
  if(!inputSearch.value ==""){
    try {
      let res = await fetch(`http://localhost:3000/busqueda?termino=${inputSearch.value}`,{
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },        
      });
      arrayContactos = await res.json();
      clearOptions(bodyTablaContactos);
      addContactos()
    } catch (error) {
      console.log("Algo salió mal ", error);
    }
  }
})
inputSearch.addEventListener("keypress",async(e)=>{
  if(e.key === "Enter"){
    if(!inputSearch.value ==""){
      try {
        let res = await fetch(`http://localhost:3000/busqueda?termino=${inputSearch.value}`,{
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },        
        });
        arrayContactos = await res.json();
        clearOptions(bodyTablaContactos);
        addContactos()
      } catch (error) {
        console.log("Algo salió mal ", error);
      }
    }  
  }
})
linkCompanias.addEventListener("click",async()=>{
  opcionesContactos.classList.add("none");
  contactos.classList.add("none");
  regiones.classList.add("none")
  usuarios.classList.add("none");
  companias.classList.remove("none");
  let res = await fetch("http://localhost:3000/companias",{
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("jwt")}`
    }
  });
  arrayCompanias = await res.json()
  console.log(arrayCompanias);
  addCompaniesToTable();
});
linkUsuarios.addEventListener("click",()=>{
    opcionesContactos.classList.add("none");
    contactos.classList.add("none");
    regiones.classList.add("none")    
    usuarios.classList.remove("none");
});
linkRegiones.addEventListener("click",async()=>{  
  opcionesContactos.classList.add("none");
  contactos.classList.add("none");
  usuarios.classList.add("none");
  regiones.classList.remove("none");  
  while(regionCiudad.firstElementChild){
    regionCiudad.removeChild(regionCiudad.firstElementChild);
    objeto = {
      "region": {      
      }
    }
  }
  await queryToJSON()
});
flexCheck.addEventListener("change",(e)=>{
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
    nroSeleccion.firstElementChild.textContent = contadorSeleccionadas + " selecciondas";    
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
  opCabecera.classList.toggle("none");
  opCabecera.classList.toggle("opciones-cabecera");
})
btnCrearUsuario.addEventListener("click",async()=>{
  let admin = "0";
  if(perfil.value =="Admin"){
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
          nombre: inputNombre.value,
          apellido: inputApellido.value,          
          email: inputEmailUsuario.value,
          perfil: admin,
          password: inputPasswordUsuario.value
      })
    })
    inputNombre.value = "";
    inputApellido.value ="";
    inputEmailUsuario.value = "";
    admin = "";
    inputPasswordUsuario.value = "";

    if(!res.ok){
      throw "Error al registrar usuario";
    }      
    console.log("Usuario registrado con exito");    
  } catch (error) {    
    console.log("Algo salió mal: ", error);
  }
})
btnAceptarModal.addEventListener("click",async()=>{
  try {    
    if(labelAddInModal.getAttribute("region")){
      const res = await fetch("http://localhost:3000/paises",{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body:JSON.stringify({
        nombre: inputModal.value,
        region: labelAddInModal.getAttribute("region")
      })
    })
      inputModal.value = "";
      labelAddInModal.removeAttribute("region");      
      let mensaje = await res.json()      
      if(!res.ok){
        throw mensaje;
      }
      console.log("Pais registrado");
      window.location.reload();
    } else if(labelAddInModal.getAttribute("pais")){      
      const res = await fetch("http://localhost:3000/ciudades",{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body:JSON.stringify({
        nombre: inputModal.value,
        pais: labelAddInModal.getAttribute("pais")
      })
    })
      if(!res.ok){
        let mensaje = await res.json()        
        throw mensaje;
      }
      console.log("Ciudad registrada");
      inputModal.value = "";
      labelAddInModal.removeAttribute("pais");      
      window.location.reload();      
    
    }else if(labelAddInModal.getAttribute("epais")){
      const res = await fetch(`http://localhost:3000/paises/${labelAddInModal.getAttribute("epais")}`,{
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body:JSON.stringify({
        nombre: inputModal.value,        
      })
    })
      inputModal.value = "";
      labelAddInModal.removeAttribute("epais");      
      let mensaje = await res.json()      
      if(!res.ok){
        throw mensaje;
      }
      console.log("Pais actualizado");
      window.location.reload();
    }else if(labelAddInModal.getAttribute("eciudad")){
      const res = await fetch(`http://localhost:3000/ciudades/${labelAddInModal.getAttribute("eciudad")}`,{
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body:JSON.stringify({
        nombre: inputModal.value,        
      })
    })
      inputModal.value = "";
      labelAddInModal.removeAttribute("eciudad");      
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
        inputModal.value = "";        
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
    }else if(labelAddInModal.getAttribute("eregion")){
      const res = await fetch(`http://localhost:3000/regiones/${labelAddInModal.getAttribute("eregion")}`,{
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body:JSON.stringify({
        nombre: inputModal.value,        
      })
    })
      inputModal.value = "";
      labelAddInModal.removeAttribute("eregion");      
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
btnAgregarRegion.addEventListener("click",()=>{
  modalLabel.textContent = "Agregar región";
  labelAddInModal.textContent = "Escriba el nombre de la región a agregar";  
  flag = true
});
btnEliminar.addEventListener("click",async()=>{
  try {
    if(labelWarning.getAttribute("pais")){
      const res = await fetch(`http://localhost:3000/paises/${labelWarning.getAttribute("pais")}`,{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },      
    })      
      labelWarning.removeAttribute("pais");            
      if(!res.ok){
        throw 'Error al eliminar los datos';
      }
      console.log("Pais eliminado");      
    }else if(labelWarning.getAttribute("ciudad")){
      const res = await fetch(`http://localhost:3000/ciudades/${labelWarning.getAttribute("ciudad")}`,{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },      
    })      
      labelWarning.removeAttribute("ciudad");            
      if(!res.ok){
        throw 'Error al eliminar los datos';
      }
      console.log("Ciudad eliminada");      
    } else if(labelWarning.getAttribute("region")){
      const res = await fetch(`http://localhost:3000/regiones/${labelWarning.getAttribute("region")}`,{
        method: 'DELETE',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },      
      })      
        labelWarning.removeAttribute("region");            
        if(!res.ok){
          throw 'Error al eliminar los datos';
        }
        console.log("Región eliminada");      
    } else if(labelWarning.getAttribute("compania")){
      const res = await fetch(`http://localhost:3000/companias/${labelWarning.getAttribute("compania")}`,{
        method: 'DELETE',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },      
      })      
        labelWarning.removeAttribute("region");            
        if(!res.ok){
          throw 'Error al eliminar los datos';
        }
        console.log("Compania eliminada");      
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
btnAceptarModalCompania.addEventListener("click",async()=>{
  try {    
    let comp = modalCompania.getAttribute("compania");    
    if(!comp){
      let res = await fetch("http://localhost:3000/companias",{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },
        body:JSON.stringify({
          nombre: inputModalCompaniaNombre.value,        
          email: inputModalCompaniaEmail.value,
          direccion: inputModalCompaniaDireccion.value,
          telefono: inputModalCompaniaTelefono.value,
          ciudad: optionsCiudad.value
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
      let res = await fetch(`http://localhost:3000/companias/${modalCompania.getAttribute("compania")}`,{
        method: 'PATCH',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },
        body:JSON.stringify({
          nombre: inputModalCompaniaNombre.value,        
          email: inputModalCompaniaEmail.value,
          direccion: inputModalCompaniaDireccion.value,
          telefono: inputModalCompaniaTelefono.value,
          ciudad: optionsCiudad.value
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

btnAddCompanias.addEventListener("click",async()=>{
  await loadOptions();  
})

linkEliminar.addEventListener("click", async()=>{
  let allChecked = document.getElementsByClassName("tr-hover");
  for (let i = 0; i < allChecked.length; i++) {    
    await deleteContacto(allChecked[i].attributes.cid.value);    
  }
  window.location.reload()
});

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
      modalLabel.textContent = "Añadir pais";      
      labelAddInModal.setAttribute("region",obj[region].id);
      labelAddInModal.textContent = "Escriba el nombre del pais a agregar"
    })

    buttonEdit.setAttribute("data-bs-target", "#exampleModal")
    buttonEdit.setAttribute("data-bs-toggle", "modal");
    buttonEdit.addEventListener("click",()=>{            
      modalLabel.textContent = "Editar región";            
      labelAddInModal.setAttribute("eregion",obj[region].id);
      inputModal.value = region
    });

    buttonDelete.setAttribute("data-bs-target", "#warningModal");
    buttonDelete.setAttribute("data-bs-toggle","modal");
    buttonDelete.addEventListener("click",()=>{
      labelWarning.textContent = `Está seguro que desea eliminar '${region}'?`
      labelWarning.setAttribute("region",obj[region].id);
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
          modalLabel.textContent = "Añadir ciudad";          
          labelAddInModal.textContent = `Escriba el nombre de la ciudad a agregar en ${spanOpciones.getAttribute("pais")}.`          
          labelAddInModal.setAttribute("pais", spanOpciones.getAttribute("id_pais"));
        })
        spanSuccess.appendChild(iconPlus);

        let spanLinkPrimary = document.createElement("span");
        spanLinkPrimary.setAttribute("class", "link-primary")        
        spanLinkPrimary.setAttribute("data-bs-target", "#exampleModal");
        spanLinkPrimary.setAttribute("data-bs-toggle","modal");
        spanLinkPrimary.addEventListener("click",()=>{
          modalLabel.textContent = "Editar pais";
          labelAddInModal.textContent = ""
          inputModal.value = spanOpciones.getAttribute("pais");
          labelAddInModal.setAttribute("epais", spanOpciones.getAttribute("id_pais"));
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
          labelWarning.textContent = `Está seguro que desea eliminar '${spanOpciones.getAttribute("pais")}'?`
          labelWarning.setAttribute("pais",spanOpciones.getAttribute("id_pais"));
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
              labelWarning.textContent = `Está seguro que desea eliminar '${spanOpciones.getAttribute("ciudad")}'?`
              labelWarning.setAttribute("ciudad",spanOpciones.getAttribute("id_ciudad"));
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
    regionCiudad.appendChild(divCardRegion);    
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
      inputModalCompaniaNombre.value = arrayCompanias[i].compania;
      inputModalCompaniaEmail.value = arrayCompanias[i].email;
      inputModalCompaniaDireccion.value = arrayCompanias[i].direccion;
      inputModalCompaniaTelefono.value = arrayCompanias[i].telefono;
      modalCompania.setAttribute("compania", arrayCompanias[i].id_compania);
      await loadOptions();
      optionsGroup.value = arrayCompanias[i].id_region;
      await loadPaises();      
      optionsPais.value = arrayCompanias[i].id_pais;
      await loadCiudades();
      optionsCiudad.value = arrayCompanias[i].id_ciudad;      
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
      labelWarning.textContent = `Está seguro que desea eliminar '${arrayCompanias[i].compania}'?`
      labelWarning.setAttribute("compania",arrayCompanias[i].id_compania);
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
    bodyTabla.appendChild(tr)
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
async function loadOptions(){
  try {
    let res = await fetch("http://localhost:3000/regiones",{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
    });
    let regiones = await res.json();        
    clearOptions(optionsGroup);        
    let emptyOption = document.createElement("option");
    emptyOption.setAttribute("selected","");
    optionsGroup.appendChild(emptyOption);
    for (let i = 0; i < regiones.length; i++) {      
      let option = document.createElement("option");            
      option.textContent = regiones[i].nombre        
      option.setAttribute("value",regiones[i].id);
      optionsGroup.appendChild(option);      
    }    
  } catch (error) {
    console.log(error);
  }
}
async function loadPaises(){  
  let res = await fetch("http://localhost:3000/paises");
  let arrayPaises = await res.json();  
  clearOptions(optionsPais);
  if(optionsCiudad.length > 1){    
    clearOptions(optionsCiudad);
  }
  let emptyOption = document.createElement("option");
  emptyOption.setAttribute("selected","");
  optionsPais.appendChild(emptyOption);
  for (let i = 0; i < arrayPaises.length; i++) {      
    let option = document.createElement("option");         
    if(arrayPaises[i].region == optionsGroup.value){
      option.textContent = arrayPaises[i].nombre  
      option.setAttribute("value",arrayPaises[i].id);      
      optionsPais.appendChild(option);    
    }
  }  
}
async function loadCiudades(){  
  
  let res = await fetch("http://localhost:3000/ciudades");
  let arrayCiudades = await res.json();  
  clearOptions(optionsCiudad);
  let emptyOption = document.createElement("option");
  emptyOption.setAttribute("selected","");
  optionsCiudad.appendChild(emptyOption);
  for (let i = 0; i < arrayCiudades.length; i++) {      
    let option = document.createElement("option");         
    if(arrayCiudades[i].pais == optionsPais.value){
      option.textContent = arrayCiudades[i].nombre        
      option.setAttribute("value",arrayCiudades[i].id)
      optionsCiudad.appendChild(option);    
    }
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
    inputModalCompaniaNombre.value = "";
    inputModalCompaniaDireccion.value = "";
    inputModalCompaniaEmail.value = "";
    inputModalCompaniaTelefono.value = "";
    modalCompania.removeAttribute("compania");
    optionsPais = document.getElementById("optionsPais");  
    clearOptions(optionsPais);
    optionsCiudad = document.getElementById("optionsCiudad");  
    clearOptions(optionsCiudad);
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
      let sp = nroSeleccion.firstElementChild
      if(e.currentTarget.checked){
        tr.classList.add("tr-hover")
        contadorSeleccionadas++;
        sp.textContent = contadorSeleccionadas + " seleccionadas";
        opCabecera.classList.remove("none");
        opCabecera.classList.add("opciones-cabecera");
      }else{
        tr.classList.remove("tr-hover")
        contadorSeleccionadas = contadorSeleccionadas -1;         
        sp.textContent = contadorSeleccionadas + " selecciondas";
        if(contadorSeleccionadas==0){
          opCabecera.classList.remove("opciones-cabecera");
          opCabecera.classList.add("none");
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
    spanLinkPrimary.appendChild(iconEdit);
    let spanLinkDanger = document.createElement("span");
    spanLinkDanger.setAttribute("class","link-danger");
    let iconDelete = document.createElement("i");
    iconDelete.setAttribute("class","far")
    iconDelete.classList.add("fa-times-circle")
    spanLinkDanger.appendChild(iconDelete);
    divOpciones.appendChild(spanLinkPrimary);
    divOpciones.appendChild(spanLinkDanger);
    tdAcciones.appendChild(divOpciones);
    tr.appendChild(tdAcciones);

    bodyTablaContactos.appendChild(tr);    
  }
}
activeLink()
formB()
