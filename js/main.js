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
let bodyTabla = document.getElementById("tbody");
let objeto = {
  "region": {      
  }
}
let arrayCompanias = []
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
}
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
})
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
      const res = await fetch(`http://localhost:3000/infociudades/${labelAddInModal.getAttribute("eregion")}`,{
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
      const res = await fetch(`http://localhost:3000/infociudades/${labelWarning.getAttribute("region")}`,{
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
    let tdUbicacion = document.createElement("td");
    tdUbicacion.textContent = arrayCompanias[i].ciudad + " - " + arrayCompanias[i].pais;
    let tdDireccion = document.createElement("td");
    tdDireccion.textContent = arrayCompanias[i].direccion;
    let tdOpciones = document.createElement("td");
    let spanPrimary = document.createElement("span");
    spanPrimary.setAttribute("class","link-primary");
    let iEdit = document.createElement("i");
    iEdit.setAttribute("class", "far fa-edit");
    spanPrimary.appendChild(iEdit);
    let spanDelete = document.createElement("span");
    spanDelete.setAttribute("class","link-danger");
    let iDelete = document.createElement("i");
    iDelete.setAttribute("class","fas fa-times-circle");
    spanDelete.appendChild(iDelete);
    tdOpciones.appendChild(spanPrimary)
    tdOpciones.appendChild(spanDelete);
    tdOpciones.setAttribute("class", "div-opciones-companias")

    tr.appendChild(tdNombre);
    tr.appendChild(tdUbicacion);
    tr.appendChild(tdDireccion);
    tr.appendChild(tdOpciones);
    bodyTabla.appendChild(tr)
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
    let optionsGroup = document.getElementById("optionsGroup");    
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
  let optionsPais = document.getElementById("optionsPais");  
  while(optionsPais.firstElementChild){
    optionsPais.removeChild(optionsPais.firstElementChild);
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
  let optionsCiudad = document.getElementById("optionsCiudad");  
  while(optionsCiudad.firstElementChild){
    optionsCiudad.removeChild(optionsCiudad.firstElementChild);
  }
  let emptyOption = document.createElement("option");
  emptyOption.setAttribute("selected","");
  optionsCiudad.appendChild(emptyOption);
  for (let i = 0; i < arrayCiudades.length; i++) {      
    let option = document.createElement("option");         
    if(arrayCiudades[i].pais == optionsPais.value){
      option.textContent = arrayCiudades[i].nombre        
      optionsCiudad.appendChild(option);    
    }
  }  
}
window.onload = ()=>{
  setTimeout(async()=>{
    await loadOptions();
    
  },1000)
}
activeLink()
formB()

